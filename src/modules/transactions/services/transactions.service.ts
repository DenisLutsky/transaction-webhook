import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityRepository, FilterQuery, QueryFlag, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Events } from 'shared/enums';
import { TransactionTypes } from '../enums';
import { PaginatedResult, Pagination } from 'shared/interfaces';
import { TransactionInput } from '../interfaces';
import { TransactionEntity } from '../entities';
import { CategoryService } from './category.service';
import { BanksService } from 'src/modules/banks/services';
import { UserEntity } from 'src/modules/users/entities';
import { TransactionEventPayload } from 'src/modules/webhooks/interfaces';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  public constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: EntityRepository<TransactionEntity>,
    @Inject(forwardRef(() => BanksService))
    private readonly banksService: BanksService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createTransaction(input: TransactionInput, user: UserEntity): Promise<TransactionEntity> {
    this.logger.debug(`Creating transaction`);

    const { amount, bankId, type } = input;

    this.validateTransaction(amount, type);

    const bank = await this.banksService.findOneById(bankId, user);

    const transaction = this.transactionsRepository.create({
      amount,
      type,
      bank,
      user,
    });

    this.transactionsRepository.persist(transaction);

    await this.banksService.changeBalance(bank, amount);

    this.eventEmitter.emit(Events.TRANSACTION_CREATED, {
      transactionId: transaction.transactionId,
      userId: user.userId,
      createdAt: transaction.createdAt,
    } as TransactionEventPayload);

    return transaction;
  }

  private async findOneById(transactionId: number, user: UserEntity): Promise<TransactionEntity> {
    this.logger.debug(`Searching for a transaction with id: ${transactionId}`);

    const transaction = await this.transactionsRepository.findOne(
      { transactionId, user, isDeleted: false },
      { populate: true },
    );

    if (!transaction) throw new NotFoundException(`No such transaction`);

    return transaction;
  }

  public async findTransactions(input: Partial<TransactionInput>): Promise<TransactionEntity[]> {
    const filter: FilterQuery<TransactionEntity> = { ...input, isDeleted: input.isDeleted || false };

    return await this.transactionsRepository.find(filter);
  }

  // TODO: redo and rename
  public async findTransactionsByDate(input: Partial<TransactionInput>): Promise<TransactionEntity[]> {
    this.logger.debug(`Searching for transactions by date`);

    const { categories, isDeleted, fromPeriod, toPeriod } = input;

    let filter: FilterQuery<TransactionEntity> = {};

    const createdAt =
      fromPeriod && toPeriod
        ? {
            $gte: fromPeriod,
            $lte: toPeriod,
          }
        : undefined;

    filter = {
      categories,
      isDeleted: isDeleted || false,
      createdAt,
    };

    return await this.transactionsRepository.find(filter, { populate: true });
  }

  public async findAllTransactionsForUser(
    user: UserEntity,
    pagination: Pagination,
  ): Promise<PaginatedResult<TransactionEntity>> {
    this.logger.debug(`Searching all transaction for user: ${user.userId}`);

    const transactions = await this.transactionsRepository.find(
      { user, isDeleted: false },
      {
        orderBy: { createdAt: QueryOrder.ASC },
        limit: pagination.limit,
        offset: pagination.offset, // TODO: resolve offset query without limit if needed
        flags: [QueryFlag.PAGINATE],
      },
    );

    return {
      rows: transactions,
      count: transactions.length,
    };
  }

  // FIXME: should not be here
  public async assignCategories(transactionId: number, categoryIds: number[], user: UserEntity): Promise<void> {
    this.logger.debug(`Assigning categories to: ${transactionId}`);

    const transaction = await this.findOneById(transactionId, user);
    const transactionCategories = transaction.categories.getItems();

    const categories = await this.categoryService.findManyCategories(categoryIds);

    transaction.assign({
      categories: [...transactionCategories, ...categories],
    });

    await this.transactionsRepository.flush();
  }

  public async deleteTransaction(transactionId: number, user: UserEntity): Promise<void> {
    this.logger.debug(`Deleting transaction: ${transactionId}`);

    const transaction = await this.findOneById(transactionId, user);

    transaction.assign({ isDeleted: true });

    const bank = await transaction.bank.load();

    const negativeAmount = transaction.amount * -1;

    await this.banksService.changeBalance(bank, negativeAmount);
  }

  private validateTransaction(amount: number, type: TransactionTypes): void {
    this.logger.debug(`Validation transaction`);

    let valid = false;

    valid = (amount > 0 && type === TransactionTypes.PROFITABLE) || valid;
    valid = (amount < 0 && type === TransactionTypes.CONSUMABLE) || valid;

    if (!valid) throw new BadRequestException(`Transaction is invalid`);
  }
}

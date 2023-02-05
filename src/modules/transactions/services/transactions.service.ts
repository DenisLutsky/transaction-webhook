import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { EntityRepository, FilterQuery, QueryFlag, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { PaginatedResult, Pagination } from 'shared/interfaces';
import { TransactionInput } from '../interfaces';
import { TransactionEntity } from '../entities';
import { BanksService } from 'src/modules/banks/services';
import { UserEntity } from 'src/modules/users/entities';
import { TransactionTypes } from '../enums';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  public constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: EntityRepository<TransactionEntity>,
    @Inject(forwardRef(() => BanksService))
    private readonly banksService: BanksService,
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

    return transaction;
  }

  private async findOneById(transactionId: number, user: UserEntity): Promise<TransactionEntity> {
    this.logger.debug(`Searching for a transaction with id: ${transactionId}`);

    const transaction = await this.transactionsRepository.findOne({ transactionId, user, isDeleted: false });

    if (!transaction) throw new NotFoundException(`No such transaction`);

    return transaction;
  }

  public async findTransactions(input: Partial<TransactionInput>): Promise<TransactionEntity[]> {
    const filter: FilterQuery<TransactionEntity> = { ...input, isDeleted: input.isDeleted || false };

    return await this.transactionsRepository.find(filter);
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

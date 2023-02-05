import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Bank, BankInput } from '../interfaces';
import { BankEntity } from '../entities';
import { UserEntity } from 'src/modules/users/entities';
import { Nullable } from 'shared/types';

@Injectable()
export class BanksService {
  private readonly logger = new Logger(BanksService.name);

  public constructor(
    @InjectRepository(BankEntity)
    private readonly banksRepository: EntityRepository<BankEntity>,
  ) {}

  public async createBank(input: BankInput): Promise<Bank> {
    this.logger.debug(`Creating new bank`);

    const { title, user } = input;

    const bank = this.banksRepository.create({
      title,
      user,
    });

    await this.banksRepository.persistAndFlush(bank);

    return {
      title: bank.title,
      balance: bank.balance,
    };
  }

  private async findOne(bankId: number, user?: UserEntity): Promise<Nullable<BankEntity>> {
    this.logger.debug(`Searching for a bank: ${bankId}`);

    return await this.banksRepository.findOne({ bankId, user, isDeleted: false });
  }

  public async findOneById(bankId: number, user: UserEntity): Promise<BankEntity> {
    this.logger.debug(`Searching for a bank with id: ${bankId}`);

    const bank = await this.findOne(bankId, user);

    if (!bank) throw new NotFoundException(`No such bank`);

    return bank;
  }

  public async findAllForUser(user: UserEntity): Promise<Bank[]> {
    this.logger.debug(`Searching for all banks for user: ${user.userId}`);

    const banks = await this.banksRepository.find({ user, isDeleted: false });

    return banks;
  }

  public async updateBank(bankId: number, user: UserEntity, input: Partial<Bank>): Promise<Bank> {
    this.logger.debug(`Updating bank: ${bankId}`);

    const bank = await this.findOneById(bankId, user);

    bank.assign({
      title: input.title || bank.title,
    });

    await this.banksRepository.flush();

    return {
      title: bank.title,
      balance: bank.balance,
    };
  }

  public async deleteBank(bankId: number, user: UserEntity): Promise<Partial<Bank>> {
    this.logger.debug(`Deleting bank: ${bankId}`);

    const bank = await this.findOne(bankId, user);

    if (!bank) throw new NotFoundException(`No such bank`);

    bank.assign({ isDeleted: true });

    await this.banksRepository.flush();

    return {
      title: bank.title,
      isDeleted: bank.isDeleted,
    };
  }
}

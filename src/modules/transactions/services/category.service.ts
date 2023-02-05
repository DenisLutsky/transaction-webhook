import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { UserEntity } from 'src/modules/users/entities';
import { CategoryEntity } from '../entities';
import { CategoryInput } from '../interfaces';
import { TransactionsService } from './transactions.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  public constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: EntityRepository<CategoryEntity>,
    private readonly transactionsService: TransactionsService,
  ) {}

  public async createCategory(input: CategoryInput, user: UserEntity): Promise<CategoryEntity> {
    this.logger.debug(`Creating transaction category`);

    const category = this.categoryRepository.create({
      title: input.title,
      user,
    });

    await this.categoryRepository.persistAndFlush(category);

    return category;
  }

  public async findOneById(categoryId: number, user: UserEntity): Promise<CategoryEntity> {
    this.logger.debug(`Searching for category with id: ${categoryId}`);

    const category = await this.categoryRepository.findOne({ categoryId, user, isDeleted: false });

    if (!category) throw new NotFoundException(`No such category`);

    return category;
  }

  public async findAllCategoryForUser(user: UserEntity): Promise<CategoryEntity[]> {
    this.logger.debug(`Searching for all category of user: ${user.userId}`);

    return await this.categoryRepository.find({ user, isDeleted: false });
  }

  public async updateCategory(
    categoryId: number,
    input: Partial<CategoryInput>,
    user: UserEntity,
  ): Promise<CategoryEntity> {
    this.logger.debug(`Updating category: ${categoryId}`);

    const category = await this.findOneById(categoryId, user);

    category.assign({
      title: input.title || category.title,
    });

    await this.categoryRepository.flush();

    return category;
  }

  public async deleteCategory(categoryId: number, user: UserEntity): Promise<void> {
    this.logger.debug(`Deleting category: ${categoryId}`);

    const category = await this.findOneById(categoryId, user);

    category.assign({ isDeleted: true });

    const transactions = await this.transactionsService.findTransactions({ categories: [{ categoryId }] });

    // TODO: optimize
    if (transactions) {
      await Promise.all(
        transactions.map(
          async ({ transactionId }) => await this.transactionsService.deleteTransaction(transactionId, user),
        ),
      );
    }

    await this.categoryRepository.flush();
  }
}

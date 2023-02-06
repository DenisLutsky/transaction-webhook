import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param, Query, Patch } from '@nestjs/common';

import { AuthGuard } from 'shared/guards';
import { CustomRequest, PaginatedResult, Pagination } from 'shared/interfaces';
import { Transaction } from '../interfaces';
import { AssignCategoriesDto, CreateTransactionDto } from '../dto';
import { TransactionsService } from '../services';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  public constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  public async createTransaction(
    @Req() { user }: CustomRequest,
    @Body() input: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.createTransaction(input, user);
  }

  @Get()
  public async findAllTransactions(
    @Req() { user }: CustomRequest,
    @Query() pagination: Pagination,
  ): Promise<PaginatedResult<Transaction>> {
    return await this.transactionsService.findAllTransactionsForUser(user, pagination);
  }

  @Patch(':id')
  public async assignCategories(
    @Req() { user }: CustomRequest,
    @Body() input: AssignCategoriesDto,
    @Param('id') transactionId: string,
  ): Promise<void> {
    return await this.transactionsService.assignCategories(+transactionId, input.categoryIds, user);
  }

  @Delete(':id')
  public async deleteTransaction(@Req() { user }: CustomRequest, @Param('id') transactionId: string): Promise<void> {
    await this.transactionsService.deleteTransaction(+transactionId, user);
  }
}

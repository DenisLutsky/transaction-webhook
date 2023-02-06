import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete } from '@nestjs/common';

import { AuthGuard } from 'shared/guards';
import { CustomRequest } from 'shared/interfaces';
import { Bank } from '../interfaces';
import { CreateBankDto, UpdateBankDto } from '../dto';
import { BanksService } from '../services';

@UseGuards(AuthGuard)
@Controller('banks')
export class BanksController {
  public constructor(private readonly banksService: BanksService) {}

  @Post()
  public async createBankAccount(@Req() { user }: CustomRequest, @Body() input: CreateBankDto): Promise<Bank> {
    return this.banksService.createBank({ ...input, user });
  }

  @Get(':id')
  public async findBank(@Req() { user }: CustomRequest, @Param('id') id: string): Promise<Bank> {
    return this.banksService.findOneById(+id, user);
  }

  @Get()
  public async findAllBank(@Req() { user }: CustomRequest): Promise<Bank[]> {
    return this.banksService.findAllForUser(user);
  }

  @Patch(':id')
  public async updateBank(
    @Req() { user }: CustomRequest,
    @Param('id') id: string,
    @Body() input: UpdateBankDto,
  ): Promise<Bank> {
    return this.banksService.updateBank(+id, user, input);
  }

  @Delete(':id')
  public async deleteBank(@Req() { user }: CustomRequest, @Param('id') id: string): Promise<Partial<Bank>> {
    return this.banksService.deleteBank(+id, user);
  }
}

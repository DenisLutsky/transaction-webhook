import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { BanksController } from './controllers';
import { BanksService } from './services';
import { BankEntity } from './entities';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [MikroOrmModule.forFeature([BankEntity]), UsersModule, TransactionsModule],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}

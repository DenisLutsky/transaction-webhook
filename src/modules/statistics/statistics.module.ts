import { Module } from '@nestjs/common';

import { StatisticsController } from './controllers';
import { StatisticsService } from './services';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TransactionsModule, UsersModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

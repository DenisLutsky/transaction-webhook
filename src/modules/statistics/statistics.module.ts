import { Module } from '@nestjs/common';

import { StatisticsController } from './controllers';
import { StatisticsService } from './services';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

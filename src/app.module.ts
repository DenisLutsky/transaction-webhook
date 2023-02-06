import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from 'configs/orm.config';

import { GlobalExceptionsFilter } from 'shared/filters';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BanksModule } from './modules/banks/banks.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(ormConfig),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    BanksModule,
    TransactionsModule,
    StatisticsModule,
    WebhooksModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TransactionsController } from './controllers';
import { TransactionsService } from './services';
import { TransactionEntity } from './entities';
import { BanksModule } from '../banks/banks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MikroOrmModule.forFeature([TransactionEntity]), forwardRef(() => BanksModule), UsersModule], // TODO: update UsersModule export/import
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

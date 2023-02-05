import { Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { CategoryController, TransactionsController } from './controllers';
import { CategoryService, TransactionsService } from './services';
import { CategoryEntity, TransactionEntity } from './entities';
import { BanksModule } from '../banks/banks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MikroOrmModule.forFeature([TransactionEntity, CategoryEntity]), forwardRef(() => BanksModule), UsersModule], // TODO: update UsersModule export/import
  controllers: [TransactionsController, CategoryController],
  providers: [TransactionsService, CategoryService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

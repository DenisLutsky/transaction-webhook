import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { BanksController } from './controllers';
import { BanksService } from './services';
import { BankEntity } from './entities';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MikroOrmModule.forFeature([BankEntity]), UsersModule],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}

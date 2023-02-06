import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { WebhooksController } from './controllers';
import { WebhooksService } from './services';
import { WebhookEntity } from './entities';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MikroOrmModule.forFeature([WebhookEntity]), UsersModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}

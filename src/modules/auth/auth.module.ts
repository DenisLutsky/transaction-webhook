import { Module } from '@nestjs/common';

import { AuthController } from './controllers';
import { AuthService } from './services';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

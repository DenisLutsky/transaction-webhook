import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { signToken } from 'shared/utils/jwt';
import { comparePasswords } from 'shared/utils/password';
import { UserEntity } from 'src/modules/users/entities';

import { UserInput } from 'src/modules/users/interfaces';
import { UsersService } from 'src/modules/users/services';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  public constructor(private readonly usersService: UsersService) {}

  public async register(input: UserInput): Promise<string> {
    this.logger.debug(`Registering user`);

    const newUser = await this.usersService.createUser(input);

    return await this.authorizeUser(newUser);
  }

  public async login(input: UserInput): Promise<string> {
    this.logger.debug(`Logging user`);

    const authUser = await this.authenticateUser(input.email);

    return await this.authorizeUser(authUser, input.password);
  }

  /* -------------------------------------------------------------------------- */

  private async authenticateUser(email: string): Promise<UserEntity> {
    this.logger.debug(`Authenticating user`);

    const existingUser = await this.usersService.findOne({ email });

    if (!existingUser) throw new NotFoundException(`User with email: ${email} not found`);

    return existingUser;
  }

  private async authorizeUser(user: UserEntity, password?: string): Promise<string> {
    this.logger.debug(`Authorizing user`);

    if (password) {
      await comparePasswords(password, user.password);
    }

    return signToken(user);
  }
}

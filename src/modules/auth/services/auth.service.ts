import { Injectable, Logger } from '@nestjs/common';

import { UserInput } from 'src/modules/users/interfaces';
import { UsersService } from 'src/modules/users/services';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  public constructor(private readonly usersService: UsersService) {}

  public async create(input: UserInput): Promise<any> {
    this.logger.debug(`Registering user`);

    return await this.usersService.createUser(input);
  }
}

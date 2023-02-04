import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { hashPassword } from 'shared/utils/password';
import { UserInput } from '../interfaces';
import { UserEntity } from '../entities';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: EntityRepository<UserEntity>,
  ) {}

  public async createUser(input: UserInput): Promise<UserEntity> {
    this.logger.debug(`Creating new user`);

    const hash = await hashPassword(input.password);

    const user = this.usersRepository.create({
      email: input.email,
      password: hash,
    });

    await this.usersRepository.persistAndFlush(user);

    return user;
  }
}

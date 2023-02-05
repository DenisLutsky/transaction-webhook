import { Injectable, Logger } from '@nestjs/common';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { hashPassword } from 'shared/utils/password';
import { User, UserInput } from '../interfaces';
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

    // TODO: handle duplicate
    const user = this.usersRepository.create({
      email: input.email,
      password: hash,
    });

    await this.usersRepository.persistAndFlush(user);

    return user;
  }

  public async findOne(input: Partial<User>): Promise<UserEntity> {
    const filter: FilterQuery<UserEntity> = { ...input };

    return await this.usersRepository.findOne(filter);
  }
}

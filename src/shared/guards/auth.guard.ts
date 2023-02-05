import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { getJwtPayload } from 'shared/utils/jwt';
import { UsersService } from 'src/modules/users/services';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly usersService: UsersService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const { userId } = getJwtPayload(authHeader);

    const user = await this.usersService.findOne({ userId });

    if (!user) return false;

    request.user = user;

    return true;
  }
}

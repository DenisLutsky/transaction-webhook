import * as jwt from 'jsonwebtoken';
import config from 'configs/app.config';

import { User } from 'src/modules/users/interfaces';
import { JwtPayload } from 'shared/interfaces';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export const signToken = (user: User): string => {
  const { email, userId } = user;

  return jwt.sign({ email, userId }, config.app.secret, { expiresIn: '7d' });
};

export const getJwtPayload = (authHeader: string): JwtPayload => {
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer') throw new BadRequestException(`Invalid token`);

  const payload = jwt.verify(token, config.app.secret) as JwtPayload;

  if (!payload) throw new UnauthorizedException();

  return payload;
};

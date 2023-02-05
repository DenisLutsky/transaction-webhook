import * as jwt from 'jsonwebtoken';
import config from 'configs/app.config';

import { User } from 'src/modules/users/interfaces';

export const signToken = (user: User): string => {
  const { email, userId } = user;

  return jwt.sign({ email, userId }, config.app.secret);
};

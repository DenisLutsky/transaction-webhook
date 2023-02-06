import * as jwt from 'jsonwebtoken';

import { User } from 'src/modules/users/interfaces';

export interface JwtPayload extends User, jwt.JwtPayload {}

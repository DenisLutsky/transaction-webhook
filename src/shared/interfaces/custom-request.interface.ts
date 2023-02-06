import { Request } from 'express';
import { UserEntity } from '../../modules/users/entities';

export interface CustomRequest extends Request {
  user: UserEntity;
}

import { UserEntity } from 'src/modules/users/entities';

export interface BankInput {
  title: string;
  user: UserEntity;
}

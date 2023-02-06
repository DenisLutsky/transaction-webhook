import { UserEntity } from 'src/modules/users/entities';

export interface WebhookInput {
  url: string;
  user: UserEntity;
}

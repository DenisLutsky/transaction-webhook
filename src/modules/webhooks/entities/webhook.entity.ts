import {
  BaseEntity,
  Entity,
  IdentifiedReference,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UserEntity } from 'src/modules/users/entities';

@Entity({ tableName: 'webhooks' })
export class WebhookEntity extends BaseEntity<WebhookEntity, 'webhookId'> {
  @PrimaryKey()
  public webhookId!: number;

  @Property({ columnType: 'varchar' })
  public url!: string;

  @ManyToOne(() => UserEntity, { joinColumn: 'userId', wrappedReference: true })
  public user!: IdentifiedReference<UserEntity, 'userId'>;

  @Property({ columnType: 'boolean', default: true })
  public isActive!: boolean;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp' })
  public createdAt!: Date;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp', extra: 'on update current_timestamp' })
  public updatedAt!: Date;

  public [OptionalProps]?: 'webhookId' | 'createdAt' | 'updatedAt';
}

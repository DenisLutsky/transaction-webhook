import {
  BaseEntity,
  Entity,
  Enum,
  IdentifiedReference,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { TransactionTypes } from '../enums';
import { BankEntity } from 'src/modules/banks/entities';
import { UserEntity } from 'src/modules/users/entities';

@Entity({ tableName: 'transactions' })
export class TransactionEntity extends BaseEntity<TransactionEntity, 'transactionId'> {
  @PrimaryKey()
  public transactionId!: number;

  @Property({ columnType: 'bigint' }) // value stored in pennies
  public amount!: number;

  @Enum(() => TransactionTypes)
  public type!: TransactionTypes;

  @ManyToOne(() => BankEntity, { joinColumn: 'bankId', wrappedReference: true })
  public bank!: IdentifiedReference<BankEntity, 'bankId'>;

  @ManyToOne(() => UserEntity, { joinColumn: 'userId', wrappedReference: true })
  public user!: IdentifiedReference<UserEntity, 'userId'>;

  @Property({ columnType: 'boolean', default: false })
  public isDeleted!: boolean;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp' })
  public createdAt!: Date;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp', extra: 'on update current_timestamp' })
  public updatedAt!: Date;

  public [OptionalProps]?: 'transactionId' | 'createdAt' | 'updatedAt';
}

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

@Entity({ tableName: 'banks' })
export class BankEntity extends BaseEntity<BankEntity, 'bankId'> {
  @PrimaryKey()
  public bankId!: number;

  @Property({ columnType: 'varchar(128)' })
  public title!: string;

  @Property({ columnType: 'bigint', default: 0 }) // value stored in pennies
  public balance!: number;

  @ManyToOne(() => UserEntity, { joinColumn: 'userId', wrappedReference: true })
  public user!: IdentifiedReference<UserEntity, 'userId'>;

  @Property({ columnType: 'boolean', default: false })
  public isDeleted!: boolean;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp' })
  public createdAt!: Date;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp', extra: 'on update current_timestamp' })
  public updatedAt!: Date;

  public [OptionalProps]?: 'bankId' | 'createdAt' | 'updatedAt';
}

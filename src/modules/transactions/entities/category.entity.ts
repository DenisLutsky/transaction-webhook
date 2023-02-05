import {
  BaseEntity,
  Collection,
  Entity,
  IdentifiedReference,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UserEntity } from 'src/modules/users/entities';
import { TransactionEntity } from './transaction.entity';

@Entity({ tableName: 'categories' })
export class CategoryEntity extends BaseEntity<CategoryEntity, 'categoryId'> {
  @PrimaryKey()
  public categoryId!: number;

  @Property({ columnType: 'varchar(128)' })
  public title!: string;

  @ManyToMany(() => TransactionEntity, 'categories', { pivotTable: 'transactions_to_categories' })
  public transactions!: Collection<TransactionEntity>;

  @ManyToOne(() => UserEntity, { joinColumn: 'userId', wrappedReference: true })
  public user!: IdentifiedReference<UserEntity, 'userId'>;

  @Property({ columnType: 'boolean', default: false })
  public isDeleted!: boolean;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp' })
  public createdAt!: Date;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp', extra: 'on update current_timestamp' })
  public updatedAt!: Date;

  public [OptionalProps]?: 'categoryId' | 'createdAt' | 'updatedAt';
}

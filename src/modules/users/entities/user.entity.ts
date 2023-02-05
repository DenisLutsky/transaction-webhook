import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserEntity {
  @PrimaryKey()
  public userId!: number;

  @Property({ type: String, length: 320, unique: true })
  public email!: string;

  @Property()
  public password!: string;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp' })
  public createdAt!: Date;

  @Property({ columnType: 'timestamp', defaultRaw: 'current_timestamp', extra: 'on update current_timestamp' })
  public updatedAt!: Date;

  public [OptionalProps]?: 'userId' | 'createdAt' | 'updatedAt';
}

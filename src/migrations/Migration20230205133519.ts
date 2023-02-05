import { Migration } from '@mikro-orm/migrations';

export class Migration20230205133519 extends Migration {
  public async up(): Promise<void> {
    this.addSql(
      'create table "banks" ("bankId" serial primary key, "title" varchar(128) not null, "balance" bigint not null default 0, "userId" int not null, "isDeleted" boolean not null default false, "createdAt" timestamp not null default current_timestamp, "updatedAt" timestamp not null default current_timestamp);',
    );

    this.addSql(
      'alter table "banks" add constraint "banks_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade;',
    );
  }

  public async down(): Promise<void> {
    this.addSql('drop table if exists "banks" cascade;');
  }
}

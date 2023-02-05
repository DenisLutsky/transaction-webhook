import { Migration } from '@mikro-orm/migrations';

export class Migration20230205180654 extends Migration {
  public async up(): Promise<void> {
    this.addSql(
      'create table "transactions" ("transactionId" serial primary key, "amount" bigint not null, "type" text check ("type" in (\'profitable\', \'consumable\')) not null, "bankId" int not null, "userId" int not null, "isDeleted" boolean not null default false, "createdAt" timestamp not null default current_timestamp, "updatedAt" timestamp not null default current_timestamp);',
    );

    this.addSql(
      'alter table "transactions" add constraint "transactions_bankId_foreign" foreign key ("bankId") references "banks" ("bankId") on update cascade;',
    );
    this.addSql(
      'alter table "transactions" add constraint "transactions_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade;',
    );
  }

  public async down(): Promise<void> {
    this.addSql('drop table if exists "transactions" cascade;');
  }
}

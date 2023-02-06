import { Migration } from '@mikro-orm/migrations';

export class Migration20230205200205 extends Migration {
  public async up(): Promise<void> {
    this.addSql(
      'create table "categories" ("categoryId" serial primary key, "title" varchar(128) not null, "userId" int not null, "isDeleted" boolean not null default false, "createdAt" timestamp not null default current_timestamp, "updatedAt" timestamp not null default current_timestamp);',
    );

    this.addSql(
      'create table "transactions_to_categories" ("transactionEntity" int not null, "categoryEntity" int not null, constraint "transactions_to_categories_pkey" primary key ("transactionEntity", "categoryEntity"));',
    );

    this.addSql(
      'alter table "categories" add constraint "categories_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade;',
    );

    this.addSql(
      'alter table "transactions_to_categories" add constraint "transactions_to_categories_transactionEntity_foreign" foreign key ("transactionEntity") references "transactions" ("transactionId") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "transactions_to_categories" add constraint "transactions_to_categories_categoryEntity_foreign" foreign key ("categoryEntity") references "categories" ("categoryId") on update cascade on delete cascade;',
    );
  }

  public async down(): Promise<void> {
    this.addSql(
      'alter table "transactions_to_categories" drop constraint "transactions_to_categories_categoryEntity_foreign";',
    );

    this.addSql('drop table if exists "categories" cascade;');

    this.addSql('drop table if exists "transactions_to_categories" cascade;');
  }
}

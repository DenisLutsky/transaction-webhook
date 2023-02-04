import { Migration } from '@mikro-orm/migrations';

export class Migration20230204210646 extends Migration {
  public async up(): Promise<void> {
    this.addSql(
      'create table "users" ("userId" serial primary key, "email" varchar(320) not null, "password" varchar(255) not null, "createdAt" timestamp not null default current_timestamp, "updatedAt" timestamp not null default current_timestamp);',
    );
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

  public async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}

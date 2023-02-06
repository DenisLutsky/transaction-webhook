import { Migration } from '@mikro-orm/migrations';

export class Migration20230206202557 extends Migration {
  public async up(): Promise<void> {
    this.addSql(
      'create table "webhooks" ("webhookId" serial primary key, "url" varchar not null, "userId" int not null, "isActive" boolean not null default true, "createdAt" timestamp not null default current_timestamp, "updatedAt" timestamp not null default current_timestamp);',
    );

    this.addSql(
      'alter table "webhooks" add constraint "webhooks_userId_foreign" foreign key ("userId") references "users" ("userId") on update cascade;',
    );
  }

  public async down(): Promise<void> {
    this.addSql('drop table if exists "webhooks" cascade;');
  }
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "users_accounts" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"provider" varchar,
	"provider_account_id" varchar
);

CREATE TABLE IF NOT EXISTS "users_verification_tokens" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"identifier" varchar,
	"token" varchar,
	"expires" timestamp(3) with time zone
);

ALTER TABLE "users" ADD COLUMN "image_url" varchar;
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp(3) with time zone;
CREATE INDEX IF NOT EXISTS "users_accounts_order_idx" ON "users_accounts" ("_order");
CREATE INDEX IF NOT EXISTS "users_accounts_parent_id_idx" ON "users_accounts" ("_parent_id");
CREATE INDEX IF NOT EXISTS "users_verification_tokens_order_idx" ON "users_verification_tokens" ("_order");
CREATE INDEX IF NOT EXISTS "users_verification_tokens_parent_id_idx" ON "users_verification_tokens" ("_parent_id");
DO $$ BEGIN
 ALTER TABLE "users_accounts" ADD CONSTRAINT "users_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_verification_tokens" ADD CONSTRAINT "users_verification_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "users_accounts";
DROP TABLE "users_verification_tokens";
ALTER TABLE "users" DROP COLUMN IF EXISTS "image_url";
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified";`)
};

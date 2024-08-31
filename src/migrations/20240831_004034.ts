import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_discountcodes_discount_type" AS ENUM('percentOff', 'dollarsOff');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "discountcodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"cart_description" varchar,
	"discount_amount" numeric,
	"discountType" "enum_discountcodes_discount_type",
	"starts" timestamp(3) with time zone NOT NULL,
	"expires" timestamp(3) with time zone NOT NULL,
	"home_page_details_advertised_description" varchar,
	"home_page_details_starts" timestamp(3) with time zone,
	"home_page_details_expires" timestamp(3) with time zone,
	"home_page_details_on_home_page" boolean NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "discountcodes_slug_idx" ON "discountcodes" ("slug");
CREATE INDEX IF NOT EXISTS "discountcodes_created_at_idx" ON "discountcodes" ("created_at");`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "discountcodes";`)
};

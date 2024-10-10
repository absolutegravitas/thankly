import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_categories_product_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "categories" ADD COLUMN "productType" "enum_categories_product_type";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "categories" DROP COLUMN IF EXISTS "productType";`)
};

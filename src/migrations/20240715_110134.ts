import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_city";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_state_code";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_postal_code";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items_receivers" ADD COLUMN "address_city" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_state_code" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_postal_code" varchar;`)
};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items_receivers" ADD COLUMN "name" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_formatted_address" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_address_line1" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_address_line2" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_city" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_state_code" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_postal_code" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_json" jsonb;
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "first_name";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "last_name";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_line1";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_line2";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "city";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "state";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "postcode";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_carts_items_receivers_shipping_method" ADD VALUE 'free';
ALTER TABLE "carts_items_receivers" ADD COLUMN "first_name" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "last_name" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_line1" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "address_line2" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "city" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "state" varchar;
ALTER TABLE "carts_items_receivers" ADD COLUMN "postcode" varchar;
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "name";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_formatted_address";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_address_line1";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_address_line2";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_city";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_state_code";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_postal_code";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "address_json";`)
};

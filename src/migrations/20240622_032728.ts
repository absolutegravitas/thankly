import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "carts_items_receivers" ADD COLUMN "totals_receiver_total" numeric NOT NULL;
ALTER TABLE "carts_items_receivers" ADD COLUMN "totals_receiver_thankly" numeric NOT NULL;
ALTER TABLE "carts_items_receivers" ADD COLUMN "totals_receiver_shipping" numeric NOT NULL;
ALTER TABLE "carts_items" ADD COLUMN "product_price" numeric;
ALTER TABLE "carts_items" ADD COLUMN "totals_item_total" numeric NOT NULL;
ALTER TABLE "carts_items" ADD COLUMN "totals_item_thanklys" numeric NOT NULL;
ALTER TABLE "carts_items" ADD COLUMN "totals_item_shipping" numeric NOT NULL;
ALTER TABLE "carts" ADD COLUMN "totals_cart_total" numeric NOT NULL;
ALTER TABLE "carts" ADD COLUMN "totals_cart_thanklys" numeric NOT NULL;
ALTER TABLE "carts" ADD COLUMN "totals_cart_shipping" numeric NOT NULL;
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "receiver_price";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "receiver_shipping";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "receiver_total";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "price";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "shipping";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "total";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_order_value";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_thanklys";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_shipping";`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "carts_items_receivers" ADD COLUMN "receiver_price" numeric;
ALTER TABLE "carts_items_receivers" ADD COLUMN "receiver_shipping" numeric;
ALTER TABLE "carts_items_receivers" ADD COLUMN "receiver_total" numeric;
ALTER TABLE "carts_items" ADD COLUMN "price" numeric;
ALTER TABLE "carts_items" ADD COLUMN "shipping" numeric;
ALTER TABLE "carts_items" ADD COLUMN "total" numeric;
ALTER TABLE "carts" ADD COLUMN "totals_order_value" numeric;
ALTER TABLE "carts" ADD COLUMN "totals_thanklys" numeric;
ALTER TABLE "carts" ADD COLUMN "totals_shipping" numeric;
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "totals_receiver_total";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "totals_receiver_thankly";
ALTER TABLE "carts_items_receivers" DROP COLUMN IF EXISTS "totals_receiver_shipping";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "product_price";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "totals_item_total";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "totals_item_thanklys";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "totals_item_shipping";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_cart_total";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_cart_thanklys";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_cart_shipping";`);

};

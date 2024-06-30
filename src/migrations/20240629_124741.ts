import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_products_shipping_class" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_shipping_class" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" ADD COLUMN "shippingClass" "enum_products_shipping_class";
ALTER TABLE "_products_v" ADD COLUMN "version_shippingClass" "enum__products_v_version_shipping_class";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_orders_items_receivers_shipping_method" ADD VALUE 'free';
ALTER TYPE "enum_orders_items_receivers_shipping_method" ADD VALUE 'courierParcel';
ALTER TYPE "enum_carts_items_receivers_shipping_method" ADD VALUE 'free';
ALTER TYPE "enum_carts_items_receivers_shipping_method" ADD VALUE 'courierParcel';
ALTER TABLE "products" DROP COLUMN IF EXISTS "shippingClass";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_shippingClass";`)
};

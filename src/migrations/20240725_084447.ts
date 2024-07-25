import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_products_shipping_size" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_stock_availability" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_shipping_size" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_stock_availability" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" ALTER COLUMN "shippingSize" SET DATA TYPE enum_products_shipping_size;
ALTER TABLE "_products_v" ALTER COLUMN "version_shippingSize" SET DATA TYPE enum__products_v_version_shipping_size;
ALTER TABLE "products" ADD COLUMN "prices_base_price" numeric;
ALTER TABLE "products" ADD COLUMN "prices_promo_price" numeric;
ALTER TABLE "products" ADD COLUMN "stock_availability" "enum_products_stock_availability";
ALTER TABLE "products" ADD COLUMN "stock_stock_on_hand" numeric;
ALTER TABLE "products" ADD COLUMN "stock_low_stock_threshold" numeric;
ALTER TABLE "products" ADD COLUMN "stripe_product_id" varchar;
ALTER TABLE "products" ADD COLUMN "stripe_base_price_id" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_prices_base_price" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_prices_promo_price" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stock_availability" "enum__products_v_version_stock_availability";
ALTER TABLE "_products_v" ADD COLUMN "version_stock_stock_on_hand" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stock_low_stock_threshold" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_product_id" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_base_price_id" varchar;
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_id";
ALTER TABLE "products" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "products" DROP COLUMN IF EXISTS "availability";
ALTER TABLE "products" DROP COLUMN IF EXISTS "price";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_price_id";
ALTER TABLE "products" DROP COLUMN IF EXISTS "promo_price";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock_on_hand";
ALTER TABLE "products" DROP COLUMN IF EXISTS "low_stock_threshold";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_theme";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_availability";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_price";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_price_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_promo_price";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stock_on_hand";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_low_stock_threshold";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_products_shipping_class" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_availability" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_shipping_class" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_availability" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" ALTER COLUMN "shippingSize" SET DATA TYPE enum_products_shipping_class;
ALTER TABLE "_products_v" ALTER COLUMN "version_shippingSize" SET DATA TYPE enum__products_v_version_shipping_class;
ALTER TABLE "products" ADD COLUMN "stripe_id" varchar;
ALTER TABLE "products" ADD COLUMN "theme" "enum_products_theme";
ALTER TABLE "products" ADD COLUMN "availability" "enum_products_availability";
ALTER TABLE "products" ADD COLUMN "price" numeric;
ALTER TABLE "products" ADD COLUMN "stripe_price_id" varchar;
ALTER TABLE "products" ADD COLUMN "promo_price" numeric;
ALTER TABLE "products" ADD COLUMN "stock_on_hand" numeric;
ALTER TABLE "products" ADD COLUMN "low_stock_threshold" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_id" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_theme" "enum__products_v_version_theme";
ALTER TABLE "_products_v" ADD COLUMN "version_availability" "enum__products_v_version_availability";
ALTER TABLE "_products_v" ADD COLUMN "version_price" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_price_id" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_promo_price" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stock_on_hand" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_low_stock_threshold" numeric;
ALTER TABLE "products" DROP COLUMN IF EXISTS "prices_base_price";
ALTER TABLE "products" DROP COLUMN IF EXISTS "prices_promo_price";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock_availability";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock_stock_on_hand";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stock_low_stock_threshold";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_product_id";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_base_price_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_prices_base_price";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_prices_promo_price";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stock_availability";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stock_stock_on_hand";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stock_low_stock_threshold";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_product_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_base_price_id";`)
};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "products" ADD COLUMN "prices_sale_price" numeric;
ALTER TABLE "products" ADD COLUMN "stripe_sale_price_id" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_prices_sale_price" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_sale_price_id" varchar;
ALTER TABLE "products" DROP COLUMN IF EXISTS "prices_promo_price";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_promo_price_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_prices_promo_price";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_promo_price_id";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "products" ADD COLUMN "prices_promo_price" numeric;
ALTER TABLE "products" ADD COLUMN "stripe_promo_price_id" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_prices_promo_price" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_promo_price_id" varchar;
ALTER TABLE "products" DROP COLUMN IF EXISTS "prices_sale_price";
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_sale_price_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_prices_sale_price";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_sale_price_id";`)
};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "discountcodes" ALTER COLUMN "cart_description" SET NOT NULL;
ALTER TABLE "discountcodes" ALTER COLUMN "discount_amount" SET NOT NULL;
ALTER TABLE "discountcodes" ALTER COLUMN "discountType" SET NOT NULL;
ALTER TABLE "carts" ADD COLUMN "discount_code_applied" varchar;`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "discountcodes" ALTER COLUMN "cart_description" DROP NOT NULL;
ALTER TABLE "discountcodes" ALTER COLUMN "discount_amount" DROP NOT NULL;
ALTER TABLE "discountcodes" ALTER COLUMN "discountType" DROP NOT NULL;
ALTER TABLE "carts" DROP COLUMN IF EXISTS "discount_code_applied";`)
};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "carts" ADD COLUMN "totals_order_value" numeric;
ALTER TABLE "carts" ADD COLUMN "totals_thanklys" numeric;
ALTER TABLE "carts" ADD COLUMN "totals_shipping" numeric;`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_order_value";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_thanklys";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "totals_shipping";`);

};

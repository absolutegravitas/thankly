import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "products" ADD COLUMN "promoted" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_promoted" numeric;`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "products" DROP COLUMN IF EXISTS "promoted";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_promoted";`)
};

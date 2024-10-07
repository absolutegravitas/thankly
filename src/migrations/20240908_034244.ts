import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "products" ADD COLUMN "star_rating" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_star_rating" numeric;`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "products" DROP COLUMN IF EXISTS "star_rating";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_star_rating";`)
};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "carts_items" ALTER COLUMN "_parent_id" SET DATA TYPE varchar;
ALTER TABLE "carts" ALTER COLUMN "id" SET DATA TYPE varchar;
ALTER TABLE "carts_rels" ALTER COLUMN "parent_id" SET DATA TYPE varchar;`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "carts_items" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
ALTER TABLE "carts" ALTER COLUMN "id" SET DATA TYPE serial;
ALTER TABLE "carts_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;`);

};

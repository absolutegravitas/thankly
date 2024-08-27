import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items" ALTER COLUMN "price" SET NOT NULL;`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items" ALTER COLUMN "price" DROP NOT NULL;`)
};

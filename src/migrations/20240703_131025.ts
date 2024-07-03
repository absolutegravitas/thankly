import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_carts_items_receivers_shipping_method" ADD VALUE 'free';`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_carts_items_receivers_shipping_method" ADD VALUE 'registeredMail';`)
};

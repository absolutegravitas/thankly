import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_orders_status" ADD VALUE 'shipped';
ALTER TYPE "enum_orders_status" ADD VALUE 'delivered';`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_orders_status" ADD VALUE 'processing';
ALTER TYPE "enum_orders_status" ADD VALUE 'completed';`)
};

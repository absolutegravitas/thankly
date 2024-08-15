import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "orders" RENAME COLUMN "stripe_payment_intent_i_d" TO "stripe_id";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "orders" RENAME COLUMN "stripe_id" TO "stripe_payment_intent_i_d";`)
};

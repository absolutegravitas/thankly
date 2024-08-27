import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items" ALTER COLUMN "gift_card_message" SET NOT NULL;
ALTER TABLE "carts_items" ALTER COLUMN "gift_card_writing_style" SET NOT NULL;`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts_items" ALTER COLUMN "gift_card_message" DROP NOT NULL;
ALTER TABLE "carts_items" ALTER COLUMN "gift_card_writing_style" DROP NOT NULL;`)
};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "settings" ADD COLUMN "default_gift_card_default_gift_card_id" integer;
DO $$ BEGIN
 ALTER TABLE "settings" ADD CONSTRAINT "settings_default_gift_card_default_gift_card_id_products_id_fk" FOREIGN KEY ("default_gift_card_default_gift_card_id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "settings" DROP CONSTRAINT "settings_default_gift_card_default_gift_card_id_products_id_fk";

ALTER TABLE "settings" DROP COLUMN IF EXISTS "default_gift_card_default_gift_card_id";`)
};

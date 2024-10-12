import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "settings" ALTER COLUMN "newsletter_popup_retail_list_id" DROP NOT NULL;
ALTER TABLE "settings" ALTER COLUMN "newsletter_popup_business_list_id" DROP NOT NULL;`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "settings" ALTER COLUMN "newsletter_popup_retail_list_id" SET NOT NULL;
ALTER TABLE "settings" ALTER COLUMN "newsletter_popup_business_list_id" SET NOT NULL;`)
};

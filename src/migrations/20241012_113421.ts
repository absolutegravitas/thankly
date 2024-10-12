import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "carts" ADD COLUMN "billing_subscribe_to_newsletter" boolean;
ALTER TABLE "users" ADD COLUMN "billing_address_address_line1" varchar;
ALTER TABLE "users" ADD COLUMN "billing_address_address_line2" varchar;
ALTER TABLE "users" ADD COLUMN "billing_address_city" varchar;
ALTER TABLE "users" ADD COLUMN "billing_address_state" varchar;
ALTER TABLE "users" ADD COLUMN "billing_address_postcode" varchar;
ALTER TABLE "users" ADD COLUMN "contact_number" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_enabled" boolean;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_title" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_description" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_business_checkbox_text" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_submit_message" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_submit_button_text" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_collapsed_text" varchar;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_image_id" integer;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_retail_list_id" varchar NOT NULL;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_business_list_id" varchar NOT NULL;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_delay_in_seconds" numeric;
ALTER TABLE "settings" ADD COLUMN "newsletter_popup_suppress_until" numeric;
DO $$ BEGIN
 ALTER TABLE "settings" ADD CONSTRAINT "settings_newsletter_popup_image_id_media_id_fk" FOREIGN KEY ("newsletter_popup_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "settings" DROP CONSTRAINT "settings_newsletter_popup_image_id_media_id_fk";

ALTER TABLE "carts" DROP COLUMN IF EXISTS "billing_subscribe_to_newsletter";
ALTER TABLE "users" DROP COLUMN IF EXISTS "billing_address_address_line1";
ALTER TABLE "users" DROP COLUMN IF EXISTS "billing_address_address_line2";
ALTER TABLE "users" DROP COLUMN IF EXISTS "billing_address_city";
ALTER TABLE "users" DROP COLUMN IF EXISTS "billing_address_state";
ALTER TABLE "users" DROP COLUMN IF EXISTS "billing_address_postcode";
ALTER TABLE "users" DROP COLUMN IF EXISTS "contact_number";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_enabled";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_title";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_description";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_business_checkbox_text";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_submit_message";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_submit_button_text";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_collapsed_text";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_image_id";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_retail_list_id";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_business_list_id";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_delay_in_seconds";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "newsletter_popup_suppress_until";`)
};

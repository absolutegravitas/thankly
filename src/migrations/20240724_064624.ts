import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_orders_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'onhold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_orders_items_receivers_shipping_method" AS ENUM('standardMail', 'expressMail', 'standardParcel', 'expressParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_product_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_shipping_class" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_availability" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_products_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_product_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_shipping_class" AS ENUM('mini', 'small', 'medium', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_availability" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_pages_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_pages_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__pages_v_version_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__pages_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_carts_items_receivers_shipping_method" AS ENUM('standardMail', 'expressMail', 'standardParcel', 'expressParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_users_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_users_type" AS ENUM('staff', 'guest', 'retail', 'business', 'partner');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_users_roles" AS ENUM('admin', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_forms_confirmation_type" AS ENUM('message', 'redirect');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_forms_redirect_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_menu_tabs_link_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_menu_tabs_description_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_menu_tabs_items_style" AS ENUM('default', 'featured', 'list');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_menu_tabs_items_default_link_link_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_menu_tabs_items_featured_link_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_menu_tabs_items_list_links_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_settings_footer_columns_items_link_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "orders_items_receivers" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"message" varchar,
	"shippingMethod" "enum_orders_items_receivers_shipping_method",
	"address_formatted_address" varchar,
	"address_address_line1" varchar,
	"address_address_line2" varchar,
	"address_json" jsonb,
	"totals_receiver_total" numeric NOT NULL,
	"totals_receiver_thankly" numeric NOT NULL,
	"totals_receiver_shipping" numeric,
	"errors" jsonb
);

CREATE TABLE IF NOT EXISTS "orders_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"product_price" numeric,
	"product_id" integer NOT NULL,
	"totals_item_total" numeric NOT NULL,
	"totals_item_thanklys" numeric NOT NULL,
	"totals_item_shipping" numeric
);

CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" numeric,
	"billing_ordered_by_id" integer,
	"billing_name" varchar,
	"billing_email" varchar,
	"billing_contact_number" numeric,
	"billing_org_name" varchar,
	"billing_org_id" varchar,
	"billing_billing_address_formatted_address" varchar,
	"billing_billing_address_address_line1" varchar,
	"billing_billing_address_address_line2" varchar,
	"billing_billing_address_json" jsonb,
	"status" "enum_orders_status",
	"stripe_payment_intent_i_d" varchar,
	"totals_order_thanklys" numeric NOT NULL,
	"totals_order_shipping" numeric NOT NULL,
	"totals_order_total" numeric NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "products_media" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"media_item_id" integer
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"productType" "enum_products_product_type",
	"shippingClass" "enum_products_shipping_class",
	"stripe_id" varchar,
	"theme" "enum_products_theme",
	"availability" "enum_products_availability",
	"price" numeric,
	"stripe_price_id" varchar,
	"promo_price" numeric,
	"stripe_promo_price_id" varchar,
	"stock_on_hand" numeric,
	"low_stock_threshold" numeric,
	"layout" jsonb,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_products_status"
);

CREATE TABLE IF NOT EXISTS "_products_v_version_media" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"media_item_id" integer,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_products_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_productType" "enum__products_v_version_product_type",
	"version_shippingClass" "enum__products_v_version_shipping_class",
	"version_stripe_id" varchar,
	"version_theme" "enum__products_v_version_theme",
	"version_availability" "enum__products_v_version_availability",
	"version_price" numeric,
	"version_stripe_price_id" varchar,
	"version_promo_price" numeric,
	"version_stripe_promo_price_id" varchar,
	"version_stock_on_hand" numeric,
	"version_low_stock_threshold" numeric,
	"version_layout" jsonb,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__products_v_version_status",
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
);

CREATE TABLE IF NOT EXISTS "pages_breadcrumbs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"doc_id" integer,
	"url" varchar,
	"label" varchar
);

CREATE TABLE IF NOT EXISTS "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"theme" "enum_pages_theme",
	"layout" jsonb,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"parent_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_pages_status"
);

CREATE TABLE IF NOT EXISTS "_pages_v_version_breadcrumbs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"doc_id" integer,
	"url" varchar,
	"label" varchar,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "_pages_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_theme" "enum__pages_v_version_theme",
	"version_layout" jsonb,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_parent_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__pages_v_version_status",
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
);

CREATE TABLE IF NOT EXISTS "reusable" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"layout" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"caption" jsonb,
	"dark_mode_fallback_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric
);

CREATE TABLE IF NOT EXISTS "carts_items_receivers" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"message" varchar,
	"shippingMethod" "enum_carts_items_receivers_shipping_method",
	"address_formatted_address" varchar,
	"address_address_line1" varchar,
	"address_address_line2" varchar,
	"address_json" jsonb,
	"totals_receiver_total" numeric NOT NULL,
	"totals_receiver_thankly" numeric NOT NULL,
	"totals_receiver_shipping" numeric,
	"errors" jsonb
);

CREATE TABLE IF NOT EXISTS "carts_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"product_price" numeric,
	"product_id" integer NOT NULL,
	"totals_item_total" numeric NOT NULL,
	"totals_item_thanklys" numeric NOT NULL,
	"totals_item_shipping" numeric
);

CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"totals_cart_total" numeric NOT NULL,
	"totals_cart_thanklys" numeric NOT NULL,
	"totals_cart_shipping" numeric,
	"totals_cart_shipping_discount" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users_type" (
	"order" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"value" "enum_users_type",
	"id" serial PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "users_roles" (
	"order" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"value" "enum_users_roles",
	"id" serial PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "users_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"orders_id" integer
);

CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"default_value" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_country" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"message" jsonb,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" numeric,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" varchar,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" varchar,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar,
	"width" numeric,
	"default_value" varchar,
	"required" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "forms_emails" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"email_to" varchar,
	"cc" varchar,
	"bcc" varchar,
	"reply_to" varchar,
	"email_from" varchar,
	"subject" varchar NOT NULL,
	"message" jsonb
);

CREATE TABLE IF NOT EXISTS "forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"submit_button_label" varchar,
	"confirmationType" "enum_forms_confirmation_type",
	"confirmation_message" jsonb,
	"redirect_type" "enum_forms_redirect_type",
	"redirect_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "forms_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer
);

CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"field" varchar NOT NULL,
	"value" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings_menu_tabs_description_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link_type" "enum_settings_menu_tabs_description_links_link_type",
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar
);

CREATE TABLE IF NOT EXISTS "settings_menu_tabs_items_featured_link_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link_type" "enum_settings_menu_tabs_items_featured_link_links_link_type",
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar
);

CREATE TABLE IF NOT EXISTS "settings_menu_tabs_items_list_links_links" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link_type" "enum_settings_menu_tabs_items_list_links_links_link_type",
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar
);

CREATE TABLE IF NOT EXISTS "settings_menu_tabs_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"style" "enum_settings_menu_tabs_items_style",
	"defaultLink_link_type" "enum_settings_menu_tabs_items_default_link_link_type",
	"default_link_link_new_tab" boolean,
	"default_link_link_url" varchar,
	"default_link_link_label" varchar,
	"default_link_description" varchar,
	"featured_link_tag" varchar,
	"featured_link_label" jsonb,
	"list_links_tag" varchar
);

CREATE TABLE IF NOT EXISTS "settings_menu_tabs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"enable_direct_link" boolean,
	"enable_dropdown" boolean,
	"link_type" "enum_settings_menu_tabs_link_type",
	"link_new_tab" boolean,
	"link_url" varchar,
	"description" varchar
);

CREATE TABLE IF NOT EXISTS "settings_footer_columns_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link_type" "enum_settings_footer_columns_items_link_type",
	"link_new_tab" boolean,
	"link_url" varchar,
	"link_label" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings_footer_columns" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar
);

CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"top_bar_content" jsonb,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "settings_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"products_id" integer
);

ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_parent_id_payload_preferences_id_fk";

ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_users_id_users_id_fk";

ALTER TABLE "users" ADD COLUMN "first_name" varchar;
ALTER TABLE "users" ADD COLUMN "last_name" varchar;
ALTER TABLE "users" ADD COLUMN "org_name" varchar;
ALTER TABLE "users" ADD COLUMN "org_id" varchar;
ALTER TABLE "users" ADD COLUMN "website" varchar;
ALTER TABLE "users" ADD COLUMN "status" "enum_users_status";
ALTER TABLE "users" ADD COLUMN "stripe_id" varchar;
ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
ALTER TABLE "users" ADD COLUMN "api_key" varchar;
ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
CREATE INDEX IF NOT EXISTS "orders_items_receivers_order_idx" ON "orders_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "orders_items_receivers_parent_id_idx" ON "orders_items_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "orders_items_order_idx" ON "orders_items" ("_order");
CREATE INDEX IF NOT EXISTS "orders_items_parent_id_idx" ON "orders_items" ("_parent_id");
CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_idx" ON "orders" ("order_number");
CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" ("created_at");
CREATE INDEX IF NOT EXISTS "products_media_order_idx" ON "products_media" ("_order");
CREATE INDEX IF NOT EXISTS "products_media_parent_id_idx" ON "products_media" ("_parent_id");
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products" ("slug");
CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" ("created_at");
CREATE INDEX IF NOT EXISTS "products__status_idx" ON "products" ("_status");
CREATE INDEX IF NOT EXISTS "_products_v_version_media_order_idx" ON "_products_v_version_media" ("_order");
CREATE INDEX IF NOT EXISTS "_products_v_version_media_parent_id_idx" ON "_products_v_version_media" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_products_v_version_version_slug_idx" ON "_products_v" ("version_slug");
CREATE INDEX IF NOT EXISTS "_products_v_version_version_created_at_idx" ON "_products_v" ("version_created_at");
CREATE INDEX IF NOT EXISTS "_products_v_version_version__status_idx" ON "_products_v" ("version__status");
CREATE INDEX IF NOT EXISTS "_products_v_created_at_idx" ON "_products_v" ("created_at");
CREATE INDEX IF NOT EXISTS "_products_v_updated_at_idx" ON "_products_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "_products_v_latest_idx" ON "_products_v" ("latest");
CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" ("_order");
CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" ("_parent_id");
CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" ("slug");
CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" ("created_at");
CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" ("_status");
CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" ("_order");
CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" ("version_slug");
CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" ("version_created_at");
CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" ("version__status");
CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" ("created_at");
CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" ("latest");
CREATE INDEX IF NOT EXISTS "reusable_created_at_idx" ON "reusable" ("created_at");
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" ("filename");
CREATE INDEX IF NOT EXISTS "carts_items_receivers_order_idx" ON "carts_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "carts_items_receivers_parent_id_idx" ON "carts_items_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_items_order_idx" ON "carts_items" ("_order");
CREATE INDEX IF NOT EXISTS "carts_items_parent_id_idx" ON "carts_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_created_at_idx" ON "carts" ("created_at");
CREATE INDEX IF NOT EXISTS "users_type_order_idx" ON "users_type" ("order");
CREATE INDEX IF NOT EXISTS "users_type_parent_idx" ON "users_type" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" ("order");
CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" ("order");
CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" ("path");
CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_country_order_idx" ON "forms_blocks_country" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_country_path_idx" ON "forms_blocks_country" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" ("_path");
CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" ("_order");
CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" ("_path");
CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" ("_order");
CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" ("_parent_id");
CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" ("created_at");
CREATE INDEX IF NOT EXISTS "forms_rels_order_idx" ON "forms_rels" ("order");
CREATE INDEX IF NOT EXISTS "forms_rels_parent_idx" ON "forms_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "forms_rels_path_idx" ON "forms_rels" ("path");
CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" ("_order");
CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" ("_parent_id");
CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" ("created_at");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_description_links_order_idx" ON "settings_menu_tabs_description_links" ("_order");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_description_links_parent_id_idx" ON "settings_menu_tabs_description_links" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_items_featured_link_links_order_idx" ON "settings_menu_tabs_items_featured_link_links" ("_order");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_items_featured_link_links_parent_id_idx" ON "settings_menu_tabs_items_featured_link_links" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_items_list_links_links_order_idx" ON "settings_menu_tabs_items_list_links_links" ("_order");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_items_list_links_links_parent_id_idx" ON "settings_menu_tabs_items_list_links_links" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_items_order_idx" ON "settings_menu_tabs_items" ("_order");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_items_parent_id_idx" ON "settings_menu_tabs_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_order_idx" ON "settings_menu_tabs" ("_order");
CREATE INDEX IF NOT EXISTS "settings_menu_tabs_parent_id_idx" ON "settings_menu_tabs" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_footer_columns_items_order_idx" ON "settings_footer_columns_items" ("_order");
CREATE INDEX IF NOT EXISTS "settings_footer_columns_items_parent_id_idx" ON "settings_footer_columns_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_footer_columns_order_idx" ON "settings_footer_columns" ("_order");
CREATE INDEX IF NOT EXISTS "settings_footer_columns_parent_id_idx" ON "settings_footer_columns" ("_parent_id");
CREATE INDEX IF NOT EXISTS "settings_rels_order_idx" ON "settings_rels" ("order");
CREATE INDEX IF NOT EXISTS "settings_rels_parent_idx" ON "settings_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "settings_rels_path_idx" ON "settings_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_items_receivers" ADD CONSTRAINT "orders_items_receivers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "orders_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_ordered_by_id_users_id_fk" FOREIGN KEY ("billing_ordered_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products_media" ADD CONSTRAINT "products_media_media_item_id_media_id_fk" FOREIGN KEY ("media_item_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products_media" ADD CONSTRAINT "products_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_version_media" ADD CONSTRAINT "_products_v_version_media_media_item_id_media_id_fk" FOREIGN KEY ("media_item_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_version_media" ADD CONSTRAINT "_products_v_version_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_products_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_dark_mode_fallback_id_media_id_fk" FOREIGN KEY ("dark_mode_fallback_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_items_receivers" ADD CONSTRAINT "carts_items_receivers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "carts_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "carts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_type" ADD CONSTRAINT "users_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "form_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_menu_tabs_description_links" ADD CONSTRAINT "settings_menu_tabs_description_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings_menu_tabs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_menu_tabs_items_featured_link_links" ADD CONSTRAINT "settings_menu_tabs_items_featured_link_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings_menu_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_menu_tabs_items_list_links_links" ADD CONSTRAINT "settings_menu_tabs_items_list_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings_menu_tabs_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_menu_tabs_items" ADD CONSTRAINT "settings_menu_tabs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings_menu_tabs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_menu_tabs" ADD CONSTRAINT "settings_menu_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_footer_columns_items" ADD CONSTRAINT "settings_footer_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_footer_columns" ADD CONSTRAINT "settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "settings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "settings_rels" ADD CONSTRAINT "settings_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "orders_items_receivers";
DROP TABLE "orders_items";
DROP TABLE "orders";
DROP TABLE "products_media";
DROP TABLE "products";
DROP TABLE "_products_v_version_media";
DROP TABLE "_products_v";
DROP TABLE "pages_breadcrumbs";
DROP TABLE "pages";
DROP TABLE "_pages_v_version_breadcrumbs";
DROP TABLE "_pages_v";
DROP TABLE "reusable";
DROP TABLE "media";
DROP TABLE "carts_items_receivers";
DROP TABLE "carts_items";
DROP TABLE "carts";
DROP TABLE "users_type";
DROP TABLE "users_roles";
DROP TABLE "users_rels";
DROP TABLE "forms_blocks_checkbox";
DROP TABLE "forms_blocks_country";
DROP TABLE "forms_blocks_email";
DROP TABLE "forms_blocks_message";
DROP TABLE "forms_blocks_number";
DROP TABLE "forms_blocks_select_options";
DROP TABLE "forms_blocks_select";
DROP TABLE "forms_blocks_text";
DROP TABLE "forms_blocks_textarea";
DROP TABLE "forms_emails";
DROP TABLE "forms";
DROP TABLE "forms_rels";
DROP TABLE "form_submissions_submission_data";
DROP TABLE "form_submissions";
DROP TABLE "settings_menu_tabs_description_links";
DROP TABLE "settings_menu_tabs_items_featured_link_links";
DROP TABLE "settings_menu_tabs_items_list_links_links";
DROP TABLE "settings_menu_tabs_items";
DROP TABLE "settings_menu_tabs";
DROP TABLE "settings_footer_columns_items";
DROP TABLE "settings_footer_columns";
DROP TABLE "settings";
DROP TABLE "settings_rels";
ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_parent_fk";

ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_users_fk";

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_id_payload_preferences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "org_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "org_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "website";
ALTER TABLE "users" DROP COLUMN IF EXISTS "status";
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "enable_a_p_i_key";
ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key";
ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key_index";`)
};

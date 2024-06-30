import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_orders_items_receivers_shipping_method" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_carts_items_receivers_shipping_method" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DROP TABLE "orders_rels";
DROP TABLE "products_rels";
DROP TABLE "_products_v_rels";
DROP TABLE "pages_rels";
DROP TABLE "_pages_v_rels";
DROP TABLE "media_rels";
DROP TABLE "carts_rels";
DROP TABLE "redirects";
DROP TABLE "redirects_rels";
DROP TABLE "form_submissions_rels";
ALTER TABLE "users_type" DROP CONSTRAINT "users_type_parent_fk";

ALTER TABLE "users_roles" DROP CONSTRAINT "users_roles_parent_fk";

ALTER TABLE "orders_items_receivers" ALTER COLUMN "shippingMethod" SET DATA TYPE enum_orders_items_receivers_shipping_method;
ALTER TABLE "carts_items_receivers" ALTER COLUMN "shippingMethod" SET DATA TYPE enum_carts_items_receivers_shipping_method;
ALTER TABLE "carts_items_receivers" ALTER COLUMN "totals_receiver_shipping" DROP NOT NULL;
ALTER TABLE "carts_items" ALTER COLUMN "totals_item_shipping" DROP NOT NULL;
ALTER TABLE "carts" ALTER COLUMN "totals_cart_shipping" DROP NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "product_id" integer NOT NULL;
ALTER TABLE "orders" ADD COLUMN "ordered_by_id" integer;
ALTER TABLE "products_media" ADD COLUMN "media_item_id" integer;
ALTER TABLE "products" ADD COLUMN "meta_image_id" integer;
ALTER TABLE "_products_v_version_media" ADD COLUMN "media_item_id" integer;
ALTER TABLE "_products_v" ADD COLUMN "parent_id" integer;
ALTER TABLE "_products_v" ADD COLUMN "version_meta_image_id" integer;
ALTER TABLE "pages_breadcrumbs" ADD COLUMN "doc_id" integer;
ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
ALTER TABLE "pages" ADD COLUMN "parent_id" integer;
ALTER TABLE "_pages_v_version_breadcrumbs" ADD COLUMN "doc_id" integer;
ALTER TABLE "_pages_v" ADD COLUMN "parent_id" integer;
ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
ALTER TABLE "_pages_v" ADD COLUMN "version_parent_id" integer;
ALTER TABLE "media" ADD COLUMN "dark_mode_fallback_id" integer;
ALTER TABLE "carts_items" ADD COLUMN "product_id" integer NOT NULL;
ALTER TABLE "carts" ADD COLUMN "customer_id" integer;
ALTER TABLE "form_submissions" ADD COLUMN "form_id" integer NOT NULL;
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
 ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_ordered_by_id_users_id_fk" FOREIGN KEY ("ordered_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products_media" ADD CONSTRAINT "products_media_media_item_id_media_id_fk" FOREIGN KEY ("media_item_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_orders_items_receivers_shipping_option" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_carts_items_receivers_shipping_option" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_redirects_to_type" AS ENUM('reference', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "orders_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"products_id" integer
);

CREATE TABLE IF NOT EXISTS "products_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "_products_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"products_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "pages_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer,
	"pages_id" integer
);

CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "media_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "carts_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"products_id" integer
);

CREATE TABLE IF NOT EXISTS "redirects" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" varchar NOT NULL,
	"to_type" "enum_redirects_to_type",
	"to_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "redirects_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"products_id" integer
);

CREATE TABLE IF NOT EXISTS "form_submissions_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"forms_id" integer
);

ALTER TABLE "users_type" DROP CONSTRAINT "users_type_parent_fk";

ALTER TABLE "users_roles" DROP CONSTRAINT "users_roles_parent_fk";

ALTER TABLE "orders_items" DROP CONSTRAINT "orders_items_product_id_products_id_fk";

ALTER TABLE "orders" DROP CONSTRAINT "orders_ordered_by_id_users_id_fk";

ALTER TABLE "products_media" DROP CONSTRAINT "products_media_media_item_id_media_id_fk";

ALTER TABLE "products" DROP CONSTRAINT "products_meta_image_id_media_id_fk";

ALTER TABLE "_products_v_version_media" DROP CONSTRAINT "_products_v_version_media_media_item_id_media_id_fk";

ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_parent_id_products_id_fk";

ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_meta_image_id_media_id_fk";

ALTER TABLE "pages_breadcrumbs" DROP CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk";

ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";

ALTER TABLE "pages" DROP CONSTRAINT "pages_parent_id_pages_id_fk";

ALTER TABLE "_pages_v_version_breadcrumbs" DROP CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk";

ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_parent_id_pages_id_fk";

ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";

ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_parent_id_pages_id_fk";

ALTER TABLE "media" DROP CONSTRAINT "media_dark_mode_fallback_id_media_id_fk";

ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_product_id_products_id_fk";

ALTER TABLE "carts" DROP CONSTRAINT "carts_customer_id_users_id_fk";

ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_form_id_forms_id_fk";

ALTER TABLE "orders_items_receivers" ALTER COLUMN "shippingMethod" SET DATA TYPE enum_orders_items_receivers_shipping_option;
ALTER TABLE "carts_items_receivers" ALTER COLUMN "shippingMethod" SET DATA TYPE enum_carts_items_receivers_shipping_option;
ALTER TABLE "carts_items_receivers" ALTER COLUMN "totals_receiver_shipping" SET NOT NULL;
ALTER TABLE "carts_items" ALTER COLUMN "totals_item_shipping" SET NOT NULL;
ALTER TABLE "carts" ALTER COLUMN "totals_cart_shipping" SET NOT NULL;
CREATE INDEX IF NOT EXISTS "orders_rels_order_idx" ON "orders_rels" ("order");
CREATE INDEX IF NOT EXISTS "orders_rels_parent_idx" ON "orders_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "orders_rels_path_idx" ON "orders_rels" ("path");
CREATE INDEX IF NOT EXISTS "products_rels_order_idx" ON "products_rels" ("order");
CREATE INDEX IF NOT EXISTS "products_rels_parent_idx" ON "products_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "products_rels_path_idx" ON "products_rels" ("path");
CREATE INDEX IF NOT EXISTS "_products_v_rels_order_idx" ON "_products_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_products_v_rels_parent_idx" ON "_products_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_products_v_rels_path_idx" ON "_products_v_rels" ("path");
CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" ("order");
CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" ("path");
CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" ("path");
CREATE INDEX IF NOT EXISTS "media_rels_order_idx" ON "media_rels" ("order");
CREATE INDEX IF NOT EXISTS "media_rels_parent_idx" ON "media_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "media_rels_path_idx" ON "media_rels" ("path");
CREATE INDEX IF NOT EXISTS "carts_rels_order_idx" ON "carts_rels" ("order");
CREATE INDEX IF NOT EXISTS "carts_rels_parent_idx" ON "carts_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "carts_rels_path_idx" ON "carts_rels" ("path");
CREATE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" ("from");
CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" ("created_at");
CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" ("order");
CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" ("path");
CREATE INDEX IF NOT EXISTS "form_submissions_rels_order_idx" ON "form_submissions_rels" ("order");
CREATE INDEX IF NOT EXISTS "form_submissions_rels_parent_idx" ON "form_submissions_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "form_submissions_rels_path_idx" ON "form_submissions_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "users_type" ADD CONSTRAINT "users_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "product_id";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "ordered_by_id";
ALTER TABLE "products_media" DROP COLUMN IF EXISTS "media_item_id";
ALTER TABLE "products" DROP COLUMN IF EXISTS "meta_image_id";
ALTER TABLE "_products_v_version_media" DROP COLUMN IF EXISTS "media_item_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "parent_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_meta_image_id";
ALTER TABLE "pages_breadcrumbs" DROP COLUMN IF EXISTS "doc_id";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_image_id";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "parent_id";
ALTER TABLE "_pages_v_version_breadcrumbs" DROP COLUMN IF EXISTS "doc_id";
ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "parent_id";
ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_image_id";
ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_parent_id";
ALTER TABLE "media" DROP COLUMN IF EXISTS "dark_mode_fallback_id";
ALTER TABLE "carts_items" DROP COLUMN IF EXISTS "product_id";
ALTER TABLE "carts" DROP COLUMN IF EXISTS "customer_id";
ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "form_id";
DO $$ BEGIN
 ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "_products_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_rels" ADD CONSTRAINT "carts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "carts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_rels" ADD CONSTRAINT "carts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_rels" ADD CONSTRAINT "carts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "redirects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "form_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

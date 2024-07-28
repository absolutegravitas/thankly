import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_carts_status" AS ENUM('pending', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_carts_items_receivers_delivery_shipping_method" AS ENUM('standardMail', 'expressMail', 'standardParcel', 'expressParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "carts_items_receivers" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"totals_cost" numeric NOT NULL,
	"totals_shipping" numeric,
	"totals_sub_total" numeric NOT NULL,
	"totals_discount" numeric,
	"name" varchar,
	"message" varchar,
	"delivery_tracking_link" varchar,
	"delivery_shippingMethod" "enum_carts_items_receivers_delivery_shipping_method",
	"delivery_address_formatted_address" varchar,
	"delivery_address_address_line1" varchar,
	"delivery_address_address_line2" varchar,
	"delivery_address_json" jsonb,
	"errors" jsonb
);

CREATE TABLE IF NOT EXISTS "carts_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"price" numeric,
	"product_id" integer NOT NULL,
	"totals_cost" numeric NOT NULL,
	"totals_shipping" numeric,
	"totals_sub_total" numeric NOT NULL,
	"totals_discount" numeric
);

CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "enum_carts_status" NOT NULL,
	"totals_cost" numeric NOT NULL,
	"totals_shipping" numeric,
	"totals_discount" numeric,
	"totals_total" numeric NOT NULL,
	"billing_ordered_by_id" integer,
	"billing_name" varchar,
	"billing_email" varchar,
	"billing_contact_number" numeric,
	"billing_org_name" varchar,
	"billing_org_id" varchar,
	"billing_address_formatted_address" varchar,
	"billing_address_address_line1" varchar,
	"billing_address_address_line2" varchar,
	"billing_address_json" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

DROP TABLE "pages_breadcrumbs";
DROP TABLE "_pages_v_version_breadcrumbs";
ALTER TABLE "pages" DROP CONSTRAINT "pages_parent_id_pages_id_fk";

ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_parent_id_pages_id_fk";

CREATE INDEX IF NOT EXISTS "carts_items_receivers_order_idx" ON "carts_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "carts_items_receivers_parent_id_idx" ON "carts_items_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_items_order_idx" ON "carts_items" ("_order");
CREATE INDEX IF NOT EXISTS "carts_items_parent_id_idx" ON "carts_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_created_at_idx" ON "carts" ("created_at");
ALTER TABLE "pages" DROP COLUMN IF EXISTS "parent_id";
ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_parent_id";
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
 ALTER TABLE "carts" ADD CONSTRAINT "carts_billing_ordered_by_id_users_id_fk" FOREIGN KEY ("billing_ordered_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "pages_breadcrumbs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"doc_id" integer,
	"url" varchar,
	"label" varchar
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

DROP TABLE "carts_items_receivers";
DROP TABLE "carts_items";
DROP TABLE "carts";
ALTER TABLE "pages" ADD COLUMN "parent_id" integer;
ALTER TABLE "_pages_v" ADD COLUMN "version_parent_id" integer;
CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" ("_order");
CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" ("_order");
CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" ("_parent_id");
DO $$ BEGIN
 ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

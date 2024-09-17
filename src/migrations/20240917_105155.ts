import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_orders_receivers_delivery_shipping_method" AS ENUM('standardMail', 'expressMail', 'standardParcel', 'expressParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "orders_receivers" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"receiver_id" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"address_address_line1" varchar NOT NULL,
	"address_address_line2" varchar,
	"address_city" varchar NOT NULL,
	"address_state" varchar NOT NULL,
	"address_postcode" varchar NOT NULL,
	"delivery_tracking_link" varchar,
	"delivery_shippingMethod" "enum_orders_receivers_delivery_shipping_method",
	"delivery_shipping_price" numeric
);

CREATE TABLE IF NOT EXISTS "orders_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"products_id" integer
);

DROP TABLE "orders_items_receivers";
ALTER TABLE "orders_items" ALTER COLUMN "price" SET NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "item_id" varchar NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "quantity" numeric NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "receiver_id" varchar;
ALTER TABLE "orders_items" ADD COLUMN "gift_card_message" varchar NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "gift_card_writing_style" varchar NOT NULL;
ALTER TABLE "orders" ADD COLUMN "discount_code_applied" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_first_name" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_last_name" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_address_city" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_address_state" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_address_postcode" varchar;
ALTER TABLE "products" ADD COLUMN "star_rating" numeric;
ALTER TABLE "_products_v" ADD COLUMN "version_star_rating" numeric;
CREATE INDEX IF NOT EXISTS "orders_receivers_order_idx" ON "orders_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "orders_receivers_parent_id_idx" ON "orders_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "orders_rels_order_idx" ON "orders_rels" ("order");
CREATE INDEX IF NOT EXISTS "orders_rels_parent_idx" ON "orders_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "orders_rels_path_idx" ON "orders_rels" ("path");
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "totals_cost";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "totals_shipping";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "totals_sub_total";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "totals_discount";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_name";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_address_formatted_address";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_address_json";
DO $$ BEGIN
 ALTER TABLE "orders_receivers" ADD CONSTRAINT "orders_receivers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_orders_items_receivers_delivery_shipping_method" AS ENUM('standardMail', 'expressMail', 'standardParcel', 'expressParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "orders_items_receivers" (
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
	"delivery_shippingMethod" "enum_orders_items_receivers_delivery_shipping_method",
	"delivery_address_formatted_address" varchar,
	"delivery_address_address_line1" varchar,
	"delivery_address_address_line2" varchar,
	"delivery_address_json" jsonb,
	"errors" jsonb
);

DROP TABLE "orders_receivers";
DROP TABLE "orders_rels";
ALTER TABLE "orders_items" ALTER COLUMN "price" DROP NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "totals_cost" numeric NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "totals_shipping" numeric;
ALTER TABLE "orders_items" ADD COLUMN "totals_sub_total" numeric NOT NULL;
ALTER TABLE "orders_items" ADD COLUMN "totals_discount" numeric;
ALTER TABLE "orders" ADD COLUMN "billing_name" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_address_formatted_address" varchar;
ALTER TABLE "orders" ADD COLUMN "billing_address_json" jsonb;
CREATE INDEX IF NOT EXISTS "orders_items_receivers_order_idx" ON "orders_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "orders_items_receivers_parent_id_idx" ON "orders_items_receivers" ("_parent_id");
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "item_id";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "quantity";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "receiver_id";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "gift_card_message";
ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "gift_card_writing_style";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "discount_code_applied";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_first_name";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_last_name";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_address_city";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_address_state";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "billing_address_postcode";
ALTER TABLE "products" DROP COLUMN IF EXISTS "star_rating";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_star_rating";
DO $$ BEGIN
 ALTER TABLE "orders_items_receivers" ADD CONSTRAINT "orders_items_receivers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "orders_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

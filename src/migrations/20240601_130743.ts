import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_carts_items_receivers_shipping_option" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "products_media" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS "_products_v_version_media" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "carts_items_receivers" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"message" varchar,
	"address_line1" varchar,
	"address_line2" varchar,
	"city" varchar,
	"state" varchar,
	"postcode" varchar,
	"shippingOption" "enum_carts_items_receivers_shipping_option",
	"receiver_price" numeric,
	"receiver_shipping" numeric,
	"receiver_total" numeric
);

CREATE TABLE IF NOT EXISTS "carts_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"price" numeric,
	"shipping" numeric,
	"total" numeric
);

CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "carts_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"products_id" integer
);

DROP TABLE "users_cart_items_receivers";
DROP TABLE "users_cart_items";
ALTER TABLE "users_rels" DROP CONSTRAINT "users_rels_products_fk";

CREATE INDEX IF NOT EXISTS "products_media_order_idx" ON "products_media" ("_order");
CREATE INDEX IF NOT EXISTS "products_media_parent_id_idx" ON "products_media" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_products_v_version_media_order_idx" ON "_products_v_version_media" ("_order");
CREATE INDEX IF NOT EXISTS "_products_v_version_media_parent_id_idx" ON "_products_v_version_media" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_items_receivers_order_idx" ON "carts_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "carts_items_receivers_parent_id_idx" ON "carts_items_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_items_order_idx" ON "carts_items" ("_order");
CREATE INDEX IF NOT EXISTS "carts_items_parent_id_idx" ON "carts_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "carts_created_at_idx" ON "carts" ("created_at");
CREATE INDEX IF NOT EXISTS "carts_rels_order_idx" ON "carts_rels" ("order");
CREATE INDEX IF NOT EXISTS "carts_rels_parent_idx" ON "carts_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "carts_rels_path_idx" ON "carts_rels" ("path");
ALTER TABLE "users_rels" DROP COLUMN IF EXISTS "products_id";
DO $$ BEGIN
 ALTER TABLE "products_media" ADD CONSTRAINT "products_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_version_media" ADD CONSTRAINT "_products_v_version_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_products_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_items_receivers" ADD CONSTRAINT "carts_items_receivers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "carts_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "carts"("id") ON DELETE cascade ON UPDATE no action;
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
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_users_cart_items_receivers_shipping_option" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users_cart_items_receivers" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"message" varchar,
	"address_line1" varchar,
	"address_line2" varchar,
	"city" varchar,
	"state" varchar,
	"postcode" varchar,
	"shippingOption" "enum_users_cart_items_receivers_shipping_option",
	"receiver_price" numeric,
	"receiver_shipping" numeric,
	"receiver_total" numeric
);

CREATE TABLE IF NOT EXISTS "users_cart_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item_price" numeric,
	"item_total_shipping" numeric,
	"item_total" numeric
);

DROP TABLE "products_media";
DROP TABLE "_products_v_version_media";
DROP TABLE "carts_items_receivers";
DROP TABLE "carts_items";
DROP TABLE "carts";
DROP TABLE "carts_rels";
ALTER TABLE "users_rels" ADD COLUMN "products_id" integer;
CREATE INDEX IF NOT EXISTS "users_cart_items_receivers_order_idx" ON "users_cart_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "users_cart_items_receivers_parent_id_idx" ON "users_cart_items_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "users_cart_items_order_idx" ON "users_cart_items" ("_order");
CREATE INDEX IF NOT EXISTS "users_cart_items_parent_id_idx" ON "users_cart_items" ("_parent_id");
DO $$ BEGIN
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_cart_items_receivers" ADD CONSTRAINT "users_cart_items_receivers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users_cart_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_cart_items" ADD CONSTRAINT "users_cart_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

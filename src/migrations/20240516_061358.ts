import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

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
 CREATE TYPE "enum_users_cart_items_receivers_shipping_option" AS ENUM('free', 'standardMail', 'registeredMail', 'expressMail', 'standardParcel', 'expressParcel', 'courierParcel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

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

CREATE TABLE IF NOT EXISTS "users_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"orders_id" integer,
	"products_id" integer
);

CREATE TABLE IF NOT EXISTS "media_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);

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
ALTER TABLE "media" ADD COLUMN "caption" jsonb;
CREATE INDEX IF NOT EXISTS "users_type_order_idx" ON "users_type" ("order");
CREATE INDEX IF NOT EXISTS "users_type_parent_idx" ON "users_type" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" ("order");
CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_cart_items_receivers_order_idx" ON "users_cart_items_receivers" ("_order");
CREATE INDEX IF NOT EXISTS "users_cart_items_receivers_parent_id_idx" ON "users_cart_items_receivers" ("_parent_id");
CREATE INDEX IF NOT EXISTS "users_cart_items_order_idx" ON "users_cart_items" ("_order");
CREATE INDEX IF NOT EXISTS "users_cart_items_parent_id_idx" ON "users_cart_items" ("_parent_id");
CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" ("order");
CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" ("path");
CREATE INDEX IF NOT EXISTS "media_rels_order_idx" ON "media_rels" ("order");
CREATE INDEX IF NOT EXISTS "media_rels_parent_idx" ON "media_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "media_rels_path_idx" ON "media_rels" ("path");
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
 ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
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
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "users_type";
DROP TABLE "users_roles";
DROP TABLE "users_cart_items_receivers";
DROP TABLE "users_cart_items";
DROP TABLE "users_rels";
DROP TABLE "media_rels";
ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "org_name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "org_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "website";
ALTER TABLE "users" DROP COLUMN IF EXISTS "status";
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "enable_a_p_i_key";
ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key";
ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key_index";
ALTER TABLE "media" DROP COLUMN IF EXISTS "caption";`);

};

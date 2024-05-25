import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_users_role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users_accounts" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"provider" varchar,
	"provider_account_id" varchar
);

CREATE TABLE IF NOT EXISTS "users_verification_tokens" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"identifier" varchar,
	"token" varchar,
	"expires" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_token" varchar NOT NULL,
	"expires" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);

DROP TABLE "users_type";
DROP TABLE "users_roles";
DROP TABLE "users_cart_items_receivers";
DROP TABLE "users_cart_items";
DROP TABLE "users_rels";
ALTER TABLE "users" ADD COLUMN "name" varchar;
ALTER TABLE "users" ADD COLUMN "image_url" varchar;
ALTER TABLE "users" ADD COLUMN "role" "enum_users_role";
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp(3) with time zone;
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" varchar;
CREATE INDEX IF NOT EXISTS "users_accounts_order_idx" ON "users_accounts" ("_order");
CREATE INDEX IF NOT EXISTS "users_accounts_parent_id_idx" ON "users_accounts" ("_parent_id");
CREATE INDEX IF NOT EXISTS "users_verification_tokens_order_idx" ON "users_verification_tokens" ("_order");
CREATE INDEX IF NOT EXISTS "users_verification_tokens_parent_id_idx" ON "users_verification_tokens" ("_parent_id");
CREATE INDEX IF NOT EXISTS "sessions_session_token_idx" ON "sessions" ("session_token");
CREATE INDEX IF NOT EXISTS "sessions_created_at_idx" ON "sessions" ("created_at");
CREATE INDEX IF NOT EXISTS "sessions_rels_order_idx" ON "sessions_rels" ("order");
CREATE INDEX IF NOT EXISTS "sessions_rels_parent_idx" ON "sessions_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "sessions_rels_path_idx" ON "sessions_rels" ("path");
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
DO $$ BEGIN
 ALTER TABLE "users_accounts" ADD CONSTRAINT "users_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_verification_tokens" ADD CONSTRAINT "users_verification_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions_rels" ADD CONSTRAINT "sessions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions_rels" ADD CONSTRAINT "sessions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
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

DROP TABLE "users_accounts";
DROP TABLE "users_verification_tokens";
DROP TABLE "sessions";
DROP TABLE "sessions_rels";
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
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "image_url";
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified";
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_customer_id";
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
`);

};

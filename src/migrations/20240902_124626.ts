import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DO $$ BEGIN
 CREATE TYPE "enum_reviews_star_rating" AS ENUM('1', '2', '3', '4', '5');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "products_extra_details" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"details" jsonb
);

CREATE TABLE IF NOT EXISTS "_products_v_version_extra_details" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"details" jsonb,
	"_uuid" varchar
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"body" varchar,
	"starRating" "enum_reviews_star_rating",
	"review_date" timestamp(3) with time zone,
	"reviewer_name" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "products" DROP CONSTRAINT "products_categories_id_categories_id_fk";

ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_categories_id_categories_id_fk";

ALTER TABLE "products" ADD COLUMN "description" jsonb;
ALTER TABLE "products_rels" ADD COLUMN "categories_id" integer;
ALTER TABLE "products_rels" ADD COLUMN "products_id" integer;
ALTER TABLE "_products_v" ADD COLUMN "version_description" jsonb;
ALTER TABLE "_products_v_rels" ADD COLUMN "categories_id" integer;
ALTER TABLE "_products_v_rels" ADD COLUMN "products_id" integer;
CREATE INDEX IF NOT EXISTS "products_extra_details_order_idx" ON "products_extra_details" ("_order");
CREATE INDEX IF NOT EXISTS "products_extra_details_parent_id_idx" ON "products_extra_details" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_products_v_version_extra_details_order_idx" ON "_products_v_version_extra_details" ("_order");
CREATE INDEX IF NOT EXISTS "_products_v_version_extra_details_parent_id_idx" ON "_products_v_version_extra_details" ("_parent_id");
CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews" ("created_at");
DO $$ BEGIN
 ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" DROP COLUMN IF EXISTS "categories_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_categories_id";
DO $$ BEGIN
 ALTER TABLE "products_extra_details" ADD CONSTRAINT "products_extra_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_version_extra_details" ADD CONSTRAINT "_products_v_version_extra_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_products_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "products_extra_details";
DROP TABLE "_products_v_version_extra_details";
DROP TABLE "reviews";
ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_categories_fk";

ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_products_fk";

ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_categories_fk";

ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_products_fk";

ALTER TABLE "products" ADD COLUMN "categories_id" integer;
ALTER TABLE "_products_v" ADD COLUMN "version_categories_id" integer;
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_categories_id_categories_id_fk" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_categories_id_categories_id_fk" FOREIGN KEY ("version_categories_id") REFERENCES "categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" DROP COLUMN IF EXISTS "description";
ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "categories_id";
ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "products_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_description";
ALTER TABLE "_products_v_rels" DROP COLUMN IF EXISTS "categories_id";
ALTER TABLE "_products_v_rels" DROP COLUMN IF EXISTS "products_id";`)
};

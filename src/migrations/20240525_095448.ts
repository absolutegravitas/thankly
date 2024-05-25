import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_products_product_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_product_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DROP TABLE "products_breadcrumbs";
DROP TABLE "_products_v_version_breadcrumbs";
ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_products_fk";

ALTER TABLE "products" ADD COLUMN "productType" "enum_products_product_type";
ALTER TABLE "_products_v" ADD COLUMN "version_productType" "enum__products_v_version_product_type";
ALTER TABLE "products" DROP COLUMN IF EXISTS "short_description";
ALTER TABLE "products" DROP COLUMN IF EXISTS "type";
ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "products_id";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_short_description";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_type";`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_products_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_type" AS ENUM('card', 'gift');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "products_breadcrumbs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"url" varchar,
	"label" varchar
);

CREATE TABLE IF NOT EXISTS "_products_v_version_breadcrumbs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar,
	"label" varchar,
	"_uuid" varchar
);

ALTER TABLE "products" ADD COLUMN "short_description" varchar;
ALTER TABLE "products" ADD COLUMN "type" "enum_products_type";
ALTER TABLE "products_rels" ADD COLUMN "products_id" integer;
ALTER TABLE "_products_v" ADD COLUMN "version_short_description" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_type" "enum__products_v_version_type";
CREATE INDEX IF NOT EXISTS "products_breadcrumbs_order_idx" ON "products_breadcrumbs" ("_order");
CREATE INDEX IF NOT EXISTS "products_breadcrumbs_parent_id_idx" ON "products_breadcrumbs" ("_parent_id");
CREATE INDEX IF NOT EXISTS "_products_v_version_breadcrumbs_order_idx" ON "_products_v_version_breadcrumbs" ("_order");
CREATE INDEX IF NOT EXISTS "_products_v_version_breadcrumbs_parent_id_idx" ON "_products_v_version_breadcrumbs" ("_parent_id");
DO $$ BEGIN
 ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" DROP COLUMN IF EXISTS "productType";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_productType";
DO $$ BEGIN
 ALTER TABLE "products_breadcrumbs" ADD CONSTRAINT "products_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_version_breadcrumbs" ADD CONSTRAINT "_products_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_products_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_products_product_type" ADD VALUE 'addOn';
ALTER TYPE "enum__products_v_version_product_type" ADD VALUE 'addOn';
CREATE TABLE IF NOT EXISTS "carts_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"products_id" integer
);

CREATE TABLE IF NOT EXISTS "reviews_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"products_id" integer
);

ALTER TABLE "settings" ADD COLUMN "top_bar_visible" boolean;
CREATE INDEX IF NOT EXISTS "carts_rels_order_idx" ON "carts_rels" ("order");
CREATE INDEX IF NOT EXISTS "carts_rels_parent_idx" ON "carts_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "carts_rels_path_idx" ON "carts_rels" ("path");
CREATE INDEX IF NOT EXISTS "reviews_rels_order_idx" ON "reviews_rels" ("order");
CREATE INDEX IF NOT EXISTS "reviews_rels_parent_idx" ON "reviews_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "reviews_rels_path_idx" ON "reviews_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "carts_rels" ADD CONSTRAINT "carts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "carts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "carts_rels" ADD CONSTRAINT "carts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "carts_rels";
DROP TABLE "reviews_rels";
ALTER TABLE "settings" DROP COLUMN IF EXISTS "top_bar_visible";`)
};

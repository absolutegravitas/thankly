import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "reviews_rels";
ALTER TABLE "products_rels" ADD COLUMN "reviews_id" integer;
ALTER TABLE "_products_v_rels" ADD COLUMN "reviews_id" integer;
DO $$ BEGIN
 ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "reviews_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"products_id" integer
);

ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_reviews_fk";

ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_reviews_fk";

CREATE INDEX IF NOT EXISTS "reviews_rels_order_idx" ON "reviews_rels" ("order");
CREATE INDEX IF NOT EXISTS "reviews_rels_parent_idx" ON "reviews_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "reviews_rels_path_idx" ON "reviews_rels" ("path");
ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "reviews_id";
ALTER TABLE "_products_v_rels" DROP COLUMN IF EXISTS "reviews_id";
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

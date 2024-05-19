import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_products_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__products_v_version_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_pages_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum__pages_v_version_theme" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "products" ADD COLUMN "theme" "enum_products_theme";
ALTER TABLE "_products_v" ADD COLUMN "version_theme" "enum__products_v_version_theme";
ALTER TABLE "pages" ADD COLUMN "theme" "enum_pages_theme";
ALTER TABLE "_pages_v" ADD COLUMN "version_theme" "enum__pages_v_version_theme";`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "products" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_theme";
ALTER TABLE "pages" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_theme";`);

};

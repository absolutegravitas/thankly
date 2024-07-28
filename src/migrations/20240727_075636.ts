import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "media" DROP CONSTRAINT "media_dark_mode_fallback_id_media_id_fk";

ALTER TABLE "pages" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_theme";
ALTER TABLE "media" DROP COLUMN IF EXISTS "dark_mode_fallback_id";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
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

ALTER TABLE "pages" ADD COLUMN "theme" "enum_pages_theme";
ALTER TABLE "_pages_v" ADD COLUMN "version_theme" "enum__pages_v_version_theme";
ALTER TABLE "media" ADD COLUMN "dark_mode_fallback_id" integer;
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_dark_mode_fallback_id_media_id_fk" FOREIGN KEY ("dark_mode_fallback_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

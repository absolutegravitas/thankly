import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
ALTER TABLE "products" DROP COLUMN IF EXISTS "stripe_i_d";
ALTER TABLE "products" DROP COLUMN IF EXISTS "skip_sync";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_stripe_i_d";
ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_skip_sync";`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
ALTER TABLE "products" ADD COLUMN "stripe_i_d" varchar;
ALTER TABLE "products" ADD COLUMN "skip_sync" boolean;
ALTER TABLE "_products_v" ADD COLUMN "version_stripe_i_d" varchar;
ALTER TABLE "_products_v" ADD COLUMN "version_skip_sync" boolean;`);

};

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TYPE "enum_users_roles" ADD VALUE 'customer';`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
};

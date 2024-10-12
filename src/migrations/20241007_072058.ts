import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'shipped' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
        ALTER TYPE "enum_orders_status" ADD VALUE 'shipped';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'delivered' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
        ALTER TYPE "enum_orders_status" ADD VALUE 'delivered';
      END IF;
    END $$;
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'processing' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
        ALTER TYPE "enum_orders_status" ADD VALUE 'processing';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'completed' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_orders_status')) THEN
        ALTER TYPE "enum_orders_status" ADD VALUE 'completed';
      END IF;
    END $$;
  `)
}

# Thankly.co Repository

## Based on

This project is based on a one-click deployment template of Payload on Vercel + latest v3.x beta. Deployments are confirmed to be working on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpayloadcms%2Fvercel-deploy-payload-postgres&project-name=payload-project&env=PAYLOAD_SECRET&build-command=pnpm%20run%20ci&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

### Features

- [Payload](https://github.com/payloadcms/payload) pre-installed into Next.js
- PostgreSQL adapter configured for Neon
- Cloud Storage plugin configured for [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

## Additional Modifications

1. Integrated current (v2.x) payload-cms and payload-website components & code
2. Some components & UI haven't been ported over (e.g., case study / statement)
3. Forms implemented (excluding form submissions and email)
4. Blocks editor integrated into Lexical, pages now have a layout field
5. Updated serializer to render rich text basic or blocks inside Lexical
6. Hero merged into a layout block
7. Personal modifications to collections and folder structure
8. Site-specific Next.js config (hardcoded CSRF / CORS configs)
9. Data pulled via payloadHMR / payload.find due to GraphQL and CORS issues
10. E-commerce features (pending)
    - localStorage + Cookies + Server Actions for cart management
11. Vercel crons implemented (see [example](https://github.com/vercel/examples/blob/main/solutions/cron/vercel.json))

## Instructions

### Local Development

1. Clone the repository
2. Define your environment variables. Minimum required:
   ```
   POSTGRES_URL=
   PAYLOAD_SECRET=
   BLOB_READ_WRITE_TOKEN=
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```
3. Set up your local database (dockerized PostgreSQL recommended, use `./start-database.sh`)
4. First-time startup will be slow due to database table creation

#### Pre-conditions

- Local database table changes are pushed immediately (no need to run migrations)
- Ensure Docker container is started and running
- Current database script sets up a persistent volume for data retention

#### Commands (Linux)

```bash
# Start Docker service
sudo systemctl start docker

# Stop current Docker container and start a fresh one
sudo docker stop payload && sudo docker rm payload && sudo ./start-database.sh

# Update Payload types, build, and run locally
pnpm generate:types && pnpm build && pnpm dev

# Update types, create DB migrations, build, and run locally
pnpm generate:types && pnpm payload migrate:create && pnpm build && pnpm dev

# Update types and run locally
pnpm generate:types && pnpm dev
```

#### Optional: Drop all tables in PostgreSQL

```sql
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(table_record.table_name) || ' CASCADE';
    END LOOP;
END $$;
```

### Production

Run the following command every time the database structure changes to ensure proper builds on Vercel:

```bash
pnpm payload migrate:create && pnpm generate:types && pnpm build
```

### Additional Docker Commands

```bash
# List running containers
sudo docker ps

# Stop and remove payload container
sudo docker stop payload
sudo docker rm payload

# Purge all Docker data and pull new image
sudo docker system prune -a --volumes
```

### For Windows Users

```powershell
psql -U postgres -c "CREATE DATABASE payload;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE payload TO postgres;"
```

## Useful Links

- [Loops.so](https://loops.so/)
- [Use Plunk](https://app.useplunk.com/events)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpayloadcms%2Fvercel-deploy-payload-postgres&project-name=payload-project&env=PAYLOAD_SECRET&build-command=pnpm%20run%20ci&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

> One-click deployment template of Payload on Vercel

- [Payload](https://github.com/payloadcms/payload) already installed into Next.js
- PostgreSQL adapter configured for Neon
- Cloud Storage plugin configured for [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

have to run pnpm payload migrate:create every time db structure is changed otherwise payload will not build on vercel because of db migration issues and default to dev mode
push tru in postgres adaptor may fix this if you dont want a local database

LOCAL DEV
use the bash script ot start a postgresql container with the un / password set from the .env file
on local db table changes are pushed immediately so no need for migration
docker container needs to be started and running
data will be purged if container shuts down (duh)

// start docker if not already started
sudo systemctl start docker
sudo docker stop payload && sudo docker rm payload && sudo ./start-database.sh

sudo ./start-database.sh

// other
// list running containers
sudo docker ps
sudo docker stop payload
sudo docker rm payload

// purge it all pull new docker image
sudo docker system prune -a --volumes

// full build & start
pnpm generate:types && pnpm build && pnpm dev
pnpm generate:types && pnpm dev

PRODUCTION
pnpm payload migrate:create && pnpm generate:types && pnpm build

// drop all tables in postgres
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' -- Change 'public' to your schema if it's different
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(table_record.table_name) || ' CASCADE';
    END LOOP;
END $$;

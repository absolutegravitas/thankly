# thankly.co repo

## based on

> One-click deployment template of Payload on Vercel + latest v3.x beta
> deployments confirmed to be working on vercel
>
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpayloadcms%2Fvercel-deploy-payload-postgres&project-name=payload-project&env=PAYLOAD_SECRET&build-command=pnpm%20run%20ci&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

- [Payload](https://github.com/payloadcms/payload) already installed into Next.js
- PostgreSQL adapter configured for Neon
- Cloud Storage plugin configured for [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

## additional modifications

1. bake in current (v2.x) payload-cms and payload-website components & code
2. some components & ui havent been ported over (e.g. case study / statement)
3. forms (but not form submissions or email)
4. blocks editor baked into lexical so now pages have a layoutfield
5. serializer updated to render richtext basic or blocks inside lexical so this may be useful for people struggling to render blocks
6. hero has been merged into just another layout block
7. personal mods to collections, folder structure
8. site specific next config (hardcoded csrf / cors configs)
9. fighting with graphql and cors atm so all data is pulled via payloadHMR / payload.find
10. ecommerce (pending)
    10a. localStorage + Cookies + Server Actions for cart mgmt
11. vercel crons https://github.com/vercel/examples/blob/main/solutions/cron/vercel.json

## instructions

### local development

- pull repo
- define your env vars -- the min required are:
  POSTGRES_URL=
  PAYLOAD_SECRET=
  BLOB_READ_WRITE_TOKEN=
  NEXT_PUBLIC_SERVER_URL=http://localhost:3000
- setup your local db, i've used dockerised postgres via the ./start-database.sh script
- use the bash script to start a postgresql container with the un / password set from the .env file
- first time startup will be slow (db tables being created, serve

#### pre-conditions

- on local db table changes are pushed immediately so no need to run migrate
- docker container needs to be started and running (duh)
- data will be purged if container shuts down (duh)

#### commands

// start docker if not already started
sudo systemctl start docker

// stop current docker container and start a fresh one
sudo docker stop payload && sudo docker rm payload && sudo ./start-database.sh

// update payload types exports, build and run local
pnpm generate:types && pnpm build && pnpm dev
pnpm generate:types && pnpm payload migrate:create && pnpm build && pnpm dev

// just update types & run local
pnpm generate:types && pnpm dev

// in case you need to drop all tables in postgres rather than drop & start a new container
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

### production

have to run pnpm payload migrate:create every time db structure is changed otherwise payload will not build on vercel because of db migration issues and default to dev mode

// other
// list running containers
sudo docker ps
sudo docker stop payload
sudo docker rm payload

// purge it all pull new docker image
sudo docker system prune -a --volumes

PRODUCTION
pnpm payload migrate:create && pnpm generate:types && pnpm build

https://loops.so/
https://app.useplunk.com/events

For WiNDOWS

PS C:\Users\prasit> psql -U postgres -c "CREATE DATABASE payload;"
Password for user postgres:

CREATE DATABASE
PS C:\Users\prasit> psql -U postgres -c "CREATE USER postgres WITH PASSWORD 'password';"
Password for user postgres:

ERROR: role "postgres" already exists
PS C:\Users\prasit> psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE payload TO postgres;"
Password for user postgres:

GRANT
PS C:\Users\prasit>

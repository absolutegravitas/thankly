# Thankly.co Repository

## Based on

This project is based on a one-click deployment template of Payload on Vercel + latest v3.x beta. Deployments are confirmed to be working on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpayloadcms%2Fvercel-deploy-payload-postgres&project-name=payload-project&env=PAYLOAD_SECRET&build-command=pnpm%20run%20ci&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

### Features

- [Payload](https://github.com/payloadcms/payload) pre-installed into Next.js
- PostgreSQL adapter configured for Neon
- Cloud Storage plugin configured for [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- ai-digest package that produces a single file for entire codebase to pipe into Claude / chatGPT project knowledge

```bash
npx ai-digest
```

## Project Structure

### `/app`

The core of our Next.js application, containing:

- Reusable UI components (`/_components`)
- Custom CSS styles (`/_css`)
- Email templates (`/_emails`)
- SVG graphics and icons (`/_graphics`, `/_icons`)
- State management and context providers (`/_providers`)
- Data fetching and API queries (`/_queries`)
- Page routes and layouts (`/(pages)`)

### `/payload`

Houses PayloadCMS configuration and customizations:

- Content Schema for content blocks used on pages (`/_blocks`)
- Content Schema for Entities (database entities `_collections`)
- nextjs custom ui components for payloadCMS (e.g. payload logo on cms login `_components`)
- Custom field types (`/_fields`)
- Payload Specific API endpoints and middleware to expose REST / GraphQL endpoints (`/api`)
- Base payload page(s) and app entry logic (`/admin`)
- Database migration scripts (`/migrations`)

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
11. Comment generator script to comment code using ClaudeAPI, JSDoc compliant

## TO DO

1. Vercel crons (see [example](https://github.com/vercel/examples/blob/main/solutions/cron/vercel.json))
2. afterChange hook on pages and products to revalidate (refresh) them

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

# Update types, create DB migrations
pnpm generate:types && pnpm payload migrate:create
```

#### Connecting to PostgreSQL

```bash
psql -h localhost -p 5432 -U postgres -d payload
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

#### Check if there are any tables

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;
```

# Comment Generator Script

This script uses the Claude AI API to automatically generate comprehensive, JSDoc-compliant comments for your JavaScript and TypeScript files. It can process individual files or entire directories, adding insightful comments that explain the code's functionality, purpose, and any important considerations.

## Features

- Generates JSDoc-compliant file-level comments
- Adds inline comments explaining code functionality
- Supports JavaScript (.js), TypeScript (.ts), and React (.jsx, .tsx) files
- Can process individual files or entire directories
- Maintains existing code structure and formatting
- Avoids breaking JSX structure in React components
- Provides visual feedback with spinners and progress bars during execution

## Prerequisites

Before using this script, ensure you have the following installed:

- Node.js (version 12 or higher recommended)
- npm (usually comes with Node.js)

## Installation

1. Clone this repository or download the script files.

2. Navigate to the project directory and install the required dependencies:

```bash
npm install dotenv ora cli-progress
```

3. Create a `.env` file in the root directory of your project and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Anthropic API key.

## Usage

### Processing a Single File

To generate comments for a single file, use the following command:

```bash
node src/utilities/commentGenerator.js path/to/your/file.ts
```

Replace `path/to/your/file.ts` with the actual path to the file you want to process.

### Processing an Entire Directory

To generate comments for all supported files in a directory (including subdirectories), simply run the script without specifying a file:

```bash
node src/utilities/commentGenerator.js
```

This will process all .js, .ts, .jsx, and .tsx files in the current directory and its subdirectories.

## How It Works

1. The script reads the content of the specified file(s).
2. It sends the code to the Claude AI API, requesting JSDoc comments and inline explanations.
3. The API response is parsed to extract the comments.
4. File-level JSDoc comments are added at the top of the file.
5. Inline comments are inserted throughout the code, taking care not to break existing structure (especially in JSX).
6. The updated content is written back to the original file.

## Configuration

You can modify the following aspects of the script:

- `CLAUDE_API_URL`: The URL for the Claude AI API (in case it changes in the future).
- `max_tokens`: Adjust this value in the API request body to control the length of the generated comments.
- File extensions: Modify the script to include or exclude certain file types.

## Troubleshooting

- If you encounter "API key not found" errors, ensure your `.env` file is in the correct location and contains the correct API key.
- For "File not found" errors, double-check the file path you're providing to the script.
- If comments are not appearing as expected, review the Claude AI API response and adjust the parsing logic if necessary.

# Production

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

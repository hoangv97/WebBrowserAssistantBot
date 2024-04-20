# NextJS Chatbot Template

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Set up database

### PostgreSQL

Register Vercel Postgres

Create table

```sql
CREATE TABLE users (
  id BIGINT,
  userData JSONB,
  data JSONB
);
```

If you want to enable password to user the bot, insert `BOT_PASSWORD` to .env file

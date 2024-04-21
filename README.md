# Web Browser Assistant Telegram Bot

The AI-Powered Web Browser Assistant Bot for Telegram is designed to facilitate your daily tasks. It can interact with various websites to perform Q&A tasks, acting as your personal assistant.

## Technology

The bot is built using the following technologies:

- NextJS
- Browserless
- Vercel
- Vercel PostgreSQL
- OpenAI

## Getting Started

Start your Browserless Integration by using Docker or their hosted service.

Install NPM by running the following command:

```bash
npm install
```

Copy .env.local file from .env.example file

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

## Demo



https://github.com/ngviethoang/WebBrowserAssistantBot/assets/25498258/11c0127e-f818-4861-962d-7fc21becb6a0



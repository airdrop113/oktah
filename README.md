# Twitter Giveaway Backend

A Node.js backend server for managing Twitter giveaway tasks using Express and Supabase.

## Features

- Twitter OAuth2 authentication
- Task verification (likes, retweets, follows)
- Data persistence with Supabase
- Environment variable support
- Input validation with Zod

## Prerequisites

- Node.js 18 or higher
- Twitter Developer Account with OAuth2 credentials
- Supabase account and project

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `GET /api/twitter/auth/url` - Get Twitter OAuth2 authorization URL
- `POST /api/twitter/auth/callback` - Handle OAuth2 callback

### Task Verification
- `POST /api/tasks/verify/like` - Verify if user liked a tweet
- `POST /api/tasks/verify/retweet` - Verify if user retweeted
- `POST /api/tasks/verify/follow` - Verify if user follows account

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

## Database Schema

### Users Table
```sql
create table users (
  id uuid default uuid_generate_v4() primary key,
  twitter_id text unique not null,
  username text not null,
  access_token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Task Completions Table
```sql
create table task_completions (
  id uuid default uuid_generate_v4() primary key,
  user_id text references users(twitter_id),
  task_type text not null,
  tweet_id text,
  target_user_id text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
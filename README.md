# Konfide

A peer-support platform for live listener discovery, lightweight conversation requests, and permanent encrypted chat history once a listener accepts.

## Live App

- Production: `https://konfide-flame.vercel.app`
- Status: stable live request-and-chat build

## Overview

Konfide is built around one simple flow:

1. Talkers browse published listeners in `explore`
2. A talker sends a conversation request with a topic and optional context
3. The listener accepts the request
4. Both sides continue in the same permanent chat thread

The current product contract is intentionally narrow:

- no payment flow
- no appointment booking
- no calendar-slot scheduling
- no expiring chat timer

## Product Features

- Role-based auth for talkers and listeners
- Google OAuth and email/password sign-in
- Public listener profiles with publishing controls
- Explore catalog with search, topic filters, and `Active now` state
- Single listener availability toggle for accepting new requests
- Pending request limits to reduce listener overload
- Permanent shared chat history after acceptance
- Browser notification preference support
- Encrypted chat storage at rest
- Security headers, signed cookies, origin checks, and rate limits

## Specification

The authoritative requirements live in [docs/SRS.md](docs/SRS.md).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma |
| Auth | Custom cookie auth + Google OAuth |

## Main Routes

### Public
| Route | Page |
|-------|------|
| `/` | Landing page |
| `/auth` | Sign in / Sign up |
| `/join` | Listener workspace intro |

### User (authenticated)
| Route | Page |
|-------|------|
| `/explore` | Browse published listeners |
| `/explore/[listenerId]` | Listener profile |
| `/explore/[listenerId]/connect` | Send a chat request |
| `/sessions` | User session history |
| `/account` | User account |

### Listener (authenticated)
| Route | Page |
|-------|------|
| `/listener/dashboard` | Listener dashboard |
| `/listener/profile` | Edit public profile |
| `/listener/availability` | Toggle live availability |
| `/listener/sessions` | Manage incoming requests |

## Getting Started

```bash
npm install
npm run prisma:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variables:

| Variable | Purpose |
|-------|-----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Session signing secret |
| `CHAT_ENCRYPTION_KEY` | Chat encryption key for message storage |
| `GOOGLE_CLIENT_ID` | Google OAuth client id |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

Optional:

| Variable | Purpose |
|-------|-----------|
| `APP_URL` | Canonical deployed app URL |
| `NEXTAUTH_URL` | Optional compatibility URL for tooling or future integrations |

## Google OAuth Setup

Add these in Google Cloud Console.

Authorized JavaScript origins:

- `http://localhost:3000`
- `https://konfide-flame.vercel.app`

Authorized redirect URIs:

- `http://localhost:3000/api/auth/google/callback`
- `https://konfide-flame.vercel.app/api/auth/google/callback`

## Deploy To Vercel

This app is ready for Vercel as a standard Next.js project.

### 1. Create a hosted Postgres database

Do not deploy with a local URL like `postgresql://...@localhost:5432/...`. Vercel cannot reach your laptop database.

Use a hosted PostgreSQL database before deploying. If you want to stay inside the Vercel workflow, the fastest path is:

```bash
vercel install neon
```

Then connect the created database to this project and make sure Vercel exposes either `DATABASE_URL` or `POSTGRES_URL`.

### 2. Add project environment variables in Vercel

Set these in `Project Settings -> Environment Variables`:

- `DATABASE_URL` or `POSTGRES_URL`
- `AUTH_SECRET`
- `CHAT_ENCRYPTION_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APP_URL`

Recommended value:

```bash
APP_URL="https://your-project.vercel.app"
```

If `APP_URL` is missing, the app falls back to Vercel system URLs like `VERCEL_URL`, but setting `APP_URL` explicitly is still the safest option for auth redirects.

### 3. Google OAuth callback URL

Add your deployed callback URL in Google Cloud Console:

```bash
https://your-project.vercel.app/api/auth/google/callback
```

If you use a custom domain, add that callback too.

### 4. Sync the database schema

Before the first production test, sync Prisma against the hosted database:

```bash
npx prisma db push
```

### 5. Deploy

Once the env vars are added, deploy normally from Vercel.

The build already runs `prisma generate` automatically, so the Prisma client stays fresh during deployment.

## Security Notes

- Chat messages are encrypted at rest
- Mutating routes reject untrusted origins
- Auth and chat writes are rate-limited
- Session cookies are signed and `httpOnly`
- Production responses include CSP, HSTS, `X-Frame-Options`, and `nosniff`

## Local Commands

```bash
npm run dev
npm run lint
npm run build
npm run prisma:push
npm run prisma:reset
```

## Database Reset

To reset the current database and start with no users:

```bash
npm run prisma:reset
```

## License

Private - All rights reserved.

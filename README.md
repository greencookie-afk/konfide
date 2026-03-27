# Konfide

A peer-support platform where people browse live listener profiles, send a request, and start chatting once a listener accepts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma |
| Auth | Custom cookie auth + Google OAuth |

## Routes

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

## Development

```bash
npm install
npm run prisma:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Optional:

- `APP_URL` for a canonical deployed URL
- `NEXTAUTH_URL` if you want to keep a canonical app URL in env for tooling or future integrations

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

### Notes

- Google OAuth works best against a stable production URL. Preview deployments may need their own callback URLs if you want Google sign-in there too.

## Database Reset

To reset the current database and start with no users:

```bash
npm run prisma:reset
```

## License

Private - All rights reserved.

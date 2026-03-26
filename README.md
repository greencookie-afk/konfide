# Konfide

A peer-support booking platform where users browse published listener profiles, book from real availability, and track confirmed sessions in one place.

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
| `/explore/[listenerId]/book` | Book a session |
| `/sessions` | User session history |
| `/account` | User account |

### Listener (authenticated)
| Route | Page |
|-------|------|
| `/listener/dashboard` | Listener dashboard |
| `/listener/profile` | Edit public profile |
| `/listener/availability` | Edit availability |
| `/listener/sessions` | Listener bookings |

## Development

```bash
npm install
npm run prisma:generate
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

- `NEXTAUTH_URL` if you want to keep a canonical app URL in env for tooling or future integrations

## Database Reset

To reset the current database and start with no users:

```bash
npm run prisma:reset
```

## License

Private - All rights reserved.

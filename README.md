# Konfide

A peer-to-peer mental health support platform where people connect with empathetic listeners who have real-life experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| Real-time Chat | Socket.io |
| Voice/Video | PeerJS (WebRTC) |
| Payments | Stripe Connect (Escrow) |

## Routes

### Public
| Route | Page |
|-------|------|
| `/` | Landing page |
| `/auth` | Sign in / Sign up |
| `/join` | Become a Listener (info) |
| `/join/apply` | Listener application form |

### User (authenticated)
| Route | Page |
|-------|------|
| `/explore` | Browse & filter listeners |
| `/explore/[listenerId]` | Listener profile |
| `/explore/[listenerId]/book` | Book a session |
| `/sessions` | My booked sessions |
| `/sessions/[sessionId]/review` | Post-session review |

### Listener (authenticated)
| Route | Page |
|-------|------|
| `/listener/dashboard` | Stats, earnings, payouts |
| `/listener/sessions` | Upcoming bookings |
| `/listener/availability` | Set weekly schedule |

### Chat
| Route | Page |
|-------|------|
| `/chat/[sessionId]` | Live session (text, voice, video) |

### Admin
| Route | Page |
|-------|------|
| `/admin/dashboard` | Platform overview |
| `/admin/users` | User management |
| `/admin/listeners` | Listener approvals |
| `/admin/analytics` | Revenue & analytics |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Update `DATABASE_URL` in `.env`, then:

```bash
npx prisma db push
```

## License

Private — All rights reserved.

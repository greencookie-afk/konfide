# Konfide

A peer-to-peer mental health support platform where people connect with empathetic listeners who have real-life experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| Real-time Chat | Socket.io |
| Voice/Video | PeerJS (WebRTC) |
| Payments | Stripe Connect (Escrow) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── (user)/
│   │   └── explore/page.tsx            # Browse & book listeners
│   ├── (listener)/
│   │   └── dashboard/page.tsx          # Listener stats, earnings, availability
│   ├── (admin)/
│   │   └── dashboard/page.tsx          # Admin moderation panel
│   └── chat/[sessionId]/page.tsx       # Live session chat room
├── components/
│   ├── ui/                             # Reusable UI primitives
│   └── shared/                         # Shared layout components
├── lib/                                # Utility functions & configs
├── hooks/                              # Custom React hooks
├── actions/                            # Server actions
├── store/                              # Client state management
└── types/                              # TypeScript type definitions
```

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

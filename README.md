# Konfide Web Application

**Konfide** connects individuals with compassionate peer listeners who have lived through similar experiences. 

## 🏗️ Architecture
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Amber Hearth Theme
- **Database**: PostgreSQL (via Prisma ORM)
- **Real-time**: PeerJS (for completely free 1-on-1 audio/video calls)
- **Payments**: Stripe Connect (for holding escrows & payouts)

## 📂 Project Structure
This repository is pre-scaffolded so you can simply drop your Stitch UI code into the respective folders section by section!
- `src/app/page.tsx` \u2192 The main Landing Page.
- `src/app/(user)/explore/page.tsx` \u2192 The Browse Listeners page for regular users.
- `src/app/(listener)/dashboard/page.tsx` \u2192 The Listener Dashboard (Stats, Earnings, Timings).
- `src/app/(admin)/dashboard/page.tsx` \u2192 The Admin Moderation Dashboard.
- `src/app/chat/[sessionId]/page.tsx` \u2192 The unified Telegram-style real-time chat room.

## \ud83d\ude80 Getting Started
1. Start the development server (if not already running):
   ```bash
   npm run dev
   ```
2. Initialize your database:
   Update `DATABASE_URL` in your `.env` file once you create a Postgres database (e.g., Supabase/Vercel) and run:
   ```bash
   npx prisma db push
   ```

### \ud83c\udfa8 Working on the UI
Open any of the files mentioned in the **Project Structure** section above and begin replacing the placeholder code with your exported UI screens! The Amber Hearth color palette is already injected into `src/app/globals.css`.

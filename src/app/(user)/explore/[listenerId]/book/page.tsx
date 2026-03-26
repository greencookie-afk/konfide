import { notFound } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import BookingSessionForm from "@/features/booking/components/BookingSessionForm";
import { getCurrentUser } from "@/server/auth/server";
import { getBookableCalendarForListener } from "@/server/availability/service";
import { SESSION_DURATION_OPTIONS } from "@/server/availability/types";
import { getListenerProfile } from "@/server/listeners/service";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ listenerId: string }>;
}) {
  const { listenerId } = await params;
  const [listener, currentUser] = await Promise.all([getListenerProfile(listenerId), getCurrentUser()]);

  if (!listener) {
    notFound();
  }

  const calendars = await Promise.all(
    SESSION_DURATION_OPTIONS.map(async (durationMinutes) => ({
      durationMinutes,
      calendar: await getBookableCalendarForListener(listener.userId, durationMinutes),
    }))
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <section className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Booking</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Book your session with {listener.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
            Choose the duration first, then pick from the times this listener has actually opened on their calendar.
          </p>
        </section>

        <BookingSessionForm
          canBook={currentUser?.role === "TALKER"}
          listener={{
            slug: listener.slug,
            name: listener.name,
            avatarUrl: listener.avatarUrl,
            headline: listener.headline,
            ratePerMinuteCents: listener.ratePerMinuteCents,
            defaultSessionMinutes: listener.defaultSessionMinutes,
            specialties: listener.specialties,
          }}
          calendars={calendars}
        />
      </main>

      <Footer />
    </div>
  );
}

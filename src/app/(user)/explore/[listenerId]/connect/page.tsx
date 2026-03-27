import { notFound } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import BookingSessionForm from "@/features/booking/components/BookingSessionForm";
import { getCurrentUser } from "@/server/auth/server";
import { getListenerProfile } from "@/server/listeners/service";

export default async function ConnectPage({
  params,
}: {
  params: Promise<{ listenerId: string }>;
}) {
  const { listenerId } = await params;
  const [listener, currentUser] = await Promise.all([getListenerProfile(listenerId), getCurrentUser()]);

  if (!listener) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <section className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Request a chat</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Send a live request to {listener.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
            Share what you want support with, add any context that helps, and wait for the listener to accept.
          </p>
        </section>

        <BookingSessionForm
          canRequest={currentUser?.role === "TALKER"}
          listener={{
            slug: listener.slug,
            name: listener.name,
            avatarUrl: listener.avatarUrl,
            headline: listener.headline,
            specialties: listener.specialties,
            languages: listener.languages,
            isAcceptingRequests: listener.isAcceptingRequests,
            isActiveNow: listener.isActiveNow,
          }}
        />
      </main>

      <Footer />
    </div>
  );
}

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SessionInbox from "@/features/sessions/components/SessionInbox";
import { requireUser } from "@/server/auth/server";
import { getTalkerSessions } from "@/server/sessions/service";

export default async function UserSessionsPage() {
  const user = await requireUser(["TALKER"]);
  const sessions = await getTalkerSessions(user.id);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 md:px-8">
        <SessionInbox
          sessions={sessions}
          viewerRole="TALKER"
          title="Your conversations"
          description="Pending requests, accepted chats, and ended conversations all stay in one compact place."
          actionHref="/explore"
          actionLabel="Explore listeners"
        />
      </main>
      <Footer />
    </div>
  );
}

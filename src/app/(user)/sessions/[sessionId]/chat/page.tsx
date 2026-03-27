import { notFound } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SessionChatView from "@/features/sessions/components/SessionChatView";
import { requireUser } from "@/server/auth/server";
import { getSessionChatStateForUser } from "@/server/chat/service";
import { getTalkerSessionDetail } from "@/server/sessions/service";

export default async function UserSessionChatPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireUser(["TALKER"]);
  const { sessionId } = await params;
  const session = await getTalkerSessionDetail(user.id, sessionId);
  const chatState = await getSessionChatStateForUser(sessionId, user.id);

  if (!session || !chatState) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <SessionChatView
          session={session}
          viewerRole="TALKER"
          basePath={`/sessions/${session.id}`}
          currentUserId={user.id}
          initialChatState={chatState}
        />
      </main>
      <Footer />
    </div>
  );
}

import { notFound } from "next/navigation";
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
      <main className="mx-auto max-w-5xl px-0 pt-14 sm:px-4 sm:pt-16 md:px-6">
        <SessionChatView
          session={session}
          viewerRole="TALKER"
          basePath="/sessions"
          currentUserId={user.id}
          initialChatState={chatState}
        />
      </main>
    </div>
  );
}

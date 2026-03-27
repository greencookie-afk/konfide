import { notFound } from "next/navigation";
import SessionChatView from "@/features/sessions/components/SessionChatView";
import { requireUser } from "@/server/auth/server";
import { getSessionChatStateForUser } from "@/server/chat/service";
import { getListenerSessionDetail } from "@/server/sessions/service";

export default async function ListenerSessionChatPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireUser(["LISTENER"]);
  const { sessionId } = await params;
  const session = await getListenerSessionDetail(user.id, sessionId);
  const chatState = await getSessionChatStateForUser(sessionId, user.id);

  if (!session || !chatState) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <SessionChatView
        session={session}
        viewerRole="LISTENER"
        basePath="/listener/sessions"
        currentUserId={user.id}
        initialChatState={chatState}
      />
    </div>
  );
}

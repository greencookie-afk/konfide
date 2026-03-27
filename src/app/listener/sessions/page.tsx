import SessionInbox from "@/features/sessions/components/SessionInbox";
import { requireUser } from "@/server/auth/server";
import { getListenerSessions } from "@/server/sessions/service";

export default async function ListenerSessionsPage() {
  const user = await requireUser(["LISTENER"]);
  const sessions = await getListenerSessions(user.id);

  return (
    <SessionInbox
      sessions={sessions}
      viewerRole="LISTENER"
      title="Manage live chat requests"
      description="Incoming requests, active chats, and old conversations all stay here so you can open the right room quickly."
      actionHref="/listener/availability"
      actionLabel="Availability"
    />
  );
}

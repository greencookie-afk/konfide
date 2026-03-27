import { notFound } from "next/navigation";
import SessionOverview from "@/features/sessions/components/SessionOverview";
import { requireUser } from "@/server/auth/server";
import { getListenerSessionDetail } from "@/server/sessions/service";

export default async function ListenerSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireUser(["LISTENER"]);
  const { sessionId } = await params;
  const session = await getListenerSessionDetail(user.id, sessionId);

  if (!session) {
    notFound();
  }

  return <SessionOverview session={session} viewerRole="LISTENER" basePath={`/listener/sessions/${session.id}`} />;
}

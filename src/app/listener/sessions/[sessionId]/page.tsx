import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/server";

export default async function ListenerSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  await requireUser(["LISTENER"]);
  const { sessionId } = await params;
  redirect(`/listener/sessions/${sessionId}/chat`);
}

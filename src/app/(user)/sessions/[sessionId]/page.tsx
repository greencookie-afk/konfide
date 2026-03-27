import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/server";

export default async function UserSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  await requireUser(["TALKER"]);
  const { sessionId } = await params;
  redirect(`/sessions/${sessionId}/chat`);
}

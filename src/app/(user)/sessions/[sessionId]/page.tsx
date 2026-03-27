import { notFound } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SessionOverview from "@/features/sessions/components/SessionOverview";
import { requireUser } from "@/server/auth/server";
import { getTalkerSessionDetail } from "@/server/sessions/service";

export default async function UserSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireUser(["TALKER"]);
  const { sessionId } = await params;
  const session = await getTalkerSessionDetail(user.id, sessionId);

  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <SessionOverview session={session} viewerRole="TALKER" basePath={`/sessions/${session.id}`} />
      </main>
      <Footer />
    </div>
  );
}

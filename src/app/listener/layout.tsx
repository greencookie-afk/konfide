import { getListenerAvailabilityEditor } from "@/server/availability/service";
import ListenerLayoutShell from "@/components/shared/ListenerLayoutShell";
import Navbar from "@/components/shared/Navbar";
import ListenerPresenceController from "@/features/listener/components/ListenerPresenceController";
import { requireUser } from "@/server/auth/server";

export default async function ListenerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser(["LISTENER"]);
  const availability = await getListenerAvailabilityEditor(user.id);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <ListenerPresenceController initialAcceptingNewBookings={availability.acceptingNewBookings} />
      <ListenerLayoutShell>{children}</ListenerLayoutShell>
    </div>
  );
}

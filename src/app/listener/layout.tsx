import ListenerLayoutShell from "@/components/shared/ListenerLayoutShell";
import Navbar from "@/components/shared/Navbar";
import { requireUser } from "@/server/auth/server";

export default async function ListenerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser(["LISTENER"]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <ListenerLayoutShell>{children}</ListenerLayoutShell>
    </div>
  );
}

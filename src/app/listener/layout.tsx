import Footer from "@/components/shared/Footer";
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
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-8">{children}</main>
      <Footer />
    </div>
  );
}

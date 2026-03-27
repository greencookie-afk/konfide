import { notFound } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import AccountProfileEditor from "@/features/account/components/AccountProfileEditor";
import { getAccountEditorData } from "@/server/account/service";
import { requireUser } from "@/server/auth/server";

export default async function AccountPage() {
  const user = await requireUser(["TALKER"]);
  const account = await getAccountEditorData(user.id);

  if (!account) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 md:px-8">
        <section className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">My Account</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Edit your profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Keep the account surface small and practical. Update your display name here and decide whether browser
            notifications should be active on this device.
          </p>
        </section>

        <AccountProfileEditor initialData={account} />
      </main>

      <Footer />
    </div>
  );
}

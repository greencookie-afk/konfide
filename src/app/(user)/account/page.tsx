import Image from "next/image";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SignOutButton from "@/features/account/components/SignOutButton";
import { requireUser } from "@/server/auth/server";

export default async function AccountPage() {
  const user = await requireUser(["TALKER"]);
  const userInitial = (user.name || user.email || "K").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <section className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">My Account</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Your Konfide profile</h1>
        </section>

        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[28px] border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-on-surface/5">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name ? `${user.name} avatar` : "User avatar"}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-on-surface">{userInitial}</span>
                )}
              </div>
              <h2 className="text-2xl font-bold">{user.name ?? "Konfide member"}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">{user.email}</p>
              <div className="mt-5">
                <SignOutButton />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-on-surface/5 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Account details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-surface p-4">
                <UserRound className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Display name</p>
                  <p className="text-sm text-on-surface-variant">{user.name ?? "No name set yet"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-surface p-4">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Email address</p>
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-surface p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Role</p>
                  <p className="text-sm text-on-surface-variant">Talker account</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

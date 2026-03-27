import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleDot, Languages, MessageSquareMore } from "lucide-react";
import { notFound } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { getListenerProfile } from "@/server/listeners/service";

export default async function ListenerProfilePage({
  params,
}: {
  params: Promise<{ listenerId: string }>;
}) {
  const { listenerId } = await params;
  const listener = await getListenerProfile(listenerId);

  if (!listener) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative h-24 w-24 overflow-hidden rounded-[22px] bg-surface-container-highest ring-1 ring-on-surface/5">
                {listener.avatarUrl ? (
                  <Image
                    src={listener.avatarUrl}
                    alt={`${listener.name} portrait`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-on-surface">
                    {listener.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Listener profile</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{listener.name}</h1>
                <p className="mt-2 text-lg font-medium text-on-surface">{listener.headline}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant md:text-base">{listener.about}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[16px] bg-surface px-4 py-4">
                <p className="text-sm text-on-surface-variant">Activity</p>
                <p className="mt-2 text-lg font-bold text-on-surface">
                  {listener.isActiveNow ? "Active now" : "Away right now"}
                </p>
              </div>
              <div className="rounded-[16px] bg-surface px-4 py-4">
                <p className="text-sm text-on-surface-variant">Requests</p>
                <p className="mt-2 text-lg font-bold text-on-surface">
                  {listener.isAcceptingRequests ? "On and ready to queue" : "Off right now"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_0.85fr]">
              <section>
                <h2 className="text-lg font-bold text-on-surface">What this listener helps with</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {listener.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-[12px] bg-surface px-3 py-1.5 text-xs font-semibold text-on-surface-variant ring-1 ring-on-surface/5"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[18px] border border-on-surface/5 bg-surface px-4 py-4">
                <h2 className="text-lg font-bold text-on-surface">Profile details</h2>
                <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" />
                    <span>{listener.languages.join(", ") || "No languages added yet"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-4 w-4 text-primary" />
                    <span>{listener.isPublished ? "Listed in explore" : "Not published"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-4 w-4 text-primary" />
                    <span>{listener.isAcceptingRequests ? "Requests are on" : "Requests are off"}</span>
                  </div>
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-[18px] border border-on-surface/5 bg-surface px-4 py-4">
              <h2 className="text-lg font-bold text-on-surface">What to expect</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[14px] bg-surface-container-low px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Step one</p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">Share your topic and context</p>
                </div>
                <div className="rounded-[14px] bg-surface-container-low px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Step two</p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">Wait for the listener to accept</p>
                </div>
                <div className="rounded-[14px] bg-surface-container-low px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Step three</p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">Chat opens immediately after acceptance</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[20px] border border-primary/10 bg-primary-container p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-primary-container">Connect with {listener.name}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-on-primary-container">Send a request when the fit feels right.</p>
              <p className="mt-3 text-sm leading-6 text-on-primary-container/80">
                This flow stays simple for now. Just a direct request that the listener can accept when ready.
              </p>

              <div className="mt-5 rounded-[16px] bg-surface px-4 py-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="font-semibold text-on-surface">
                    {listener.isActiveNow
                      ? "Active now"
                      : listener.isAcceptingRequests
                        ? "Requests on"
                        : "Requests off"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-on-surface-variant">Flow</span>
                  <span className="font-semibold text-on-surface">Request, accept, chat</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {listener.isAcceptingRequests ? (
                  <Link
                    href={`/explore/${listener.slug}/connect`}
                    className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-on-surface transition hover:opacity-90"
                  >
                    Send a request
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 rounded-[16px] bg-primary/35 px-5 py-3 text-sm font-semibold text-on-primary-container/70">
                    Requests paused
                  </div>
                )}
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-[16px] border border-on-primary-container/20 px-5 py-3 text-sm font-semibold text-on-primary-container transition hover:bg-white/20"
                >
                  Back to explore
                </Link>
              </div>
            </section>

            <section className="rounded-[20px] border border-on-surface/5 bg-surface-container-lowest p-5 shadow-sm">
              <h2 className="text-lg font-bold text-on-surface">Why this is lighter</h2>
              <div className="mt-4 space-y-4 text-sm text-on-surface-variant">
                <div className="flex items-start gap-3">
                  <MessageSquareMore className="mt-0.5 h-4 w-4 text-primary" />
                  <p>Talkers only need to explain what they need help with.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CircleDot className="mt-0.5 h-4 w-4 text-primary" />
                  <p>Published listeners stay in explore, and the active badge only shows while they are live on site.</p>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

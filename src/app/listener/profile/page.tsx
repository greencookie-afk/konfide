import ListenerProfileEditor from "@/features/listener/components/ListenerProfileEditor";
import { requireUser } from "@/server/auth/server";
import { getListenerProfileEditorData } from "@/server/listeners/service";

export default async function ListenerProfilePage() {
  const user = await requireUser(["LISTENER"]);
  const profile = await getListenerProfileEditorData(user.id);

  return (
    <div className="space-y-6">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Public profile</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Edit your listener listing</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Save your draft whenever you want. After publishing, this listing stays visible in explore, and requests are
          controlled separately from the availability page.
        </p>
      </section>

      <ListenerProfileEditor initialData={profile} />
    </div>
  );
}

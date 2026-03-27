import AvailabilityEditor from "@/features/listener/components/AvailabilityEditor";
import { requireUser } from "@/server/auth/server";
import { getListenerAvailabilityEditor } from "@/server/availability/service";

export default async function AvailabilitySettingsPage() {
  const user = await requireUser(["LISTENER"]);
  const availability = await getListenerAvailabilityEditor(user.id);

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Availability</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Live availability</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
          Keep this simple for now: one button controls whether you appear in browse and can receive live chat
          requests.
        </p>
      </section>

      <AvailabilityEditor initialData={availability} />
    </div>
  );
}

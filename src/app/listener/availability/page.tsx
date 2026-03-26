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
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Availability settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
          Manage your weekly booking schedule here. Users only see the time slots you save on this page.
        </p>
      </section>

      <AvailabilityEditor initialData={availability} />
    </div>
  );
}

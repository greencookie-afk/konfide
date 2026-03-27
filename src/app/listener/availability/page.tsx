import { getAccountEditorData } from "@/server/account/service";
import AvailabilityEditor from "@/features/listener/components/AvailabilityEditor";
import { requireUser } from "@/server/auth/server";
import { getListenerAvailabilityEditor } from "@/server/availability/service";

export default async function AvailabilitySettingsPage() {
  const user = await requireUser(["LISTENER"]);
  const [availability, account] = await Promise.all([
    getListenerAvailabilityEditor(user.id),
    getAccountEditorData(user.id),
  ]);

  if (!account) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Availability</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Live availability</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant md:text-base">
          Keep this simple for now: one button controls whether you can receive new live chat requests, while your
          published profile stays listed in explore.
        </p>
      </section>

      <AvailabilityEditor
        initialData={availability}
        notificationSettings={{
          browserNotificationsEnabled: account.browserNotificationsEnabled,
          browserNotificationPermission: account.browserNotificationPermission,
        }}
      />
    </div>
  );
}

import { redirect } from "next/navigation";

export default async function LegacyBookingRedirectPage({
  params,
}: {
  params: Promise<{ listenerId: string }>;
}) {
  const { listenerId } = await params;
  redirect(`/explore/${listenerId}/connect`);
}

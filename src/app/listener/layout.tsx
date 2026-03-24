import { requireUser } from "@/lib/auth/server";

export default async function ListenerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser(["LISTENER"]);

  return children;
}

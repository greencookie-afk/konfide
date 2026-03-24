import { requireUser } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser(["ADMIN"]);

  return children;
}

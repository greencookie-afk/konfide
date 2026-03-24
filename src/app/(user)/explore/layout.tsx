import { requireUser } from "@/lib/auth/server";

export default async function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser(["TALKER"]);

  return children;
}

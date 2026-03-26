import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/generated/prisma";
import { getAuthPathForRole, getPathForRole } from "@/server/auth/paths";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/server/auth/session";
import { prisma } from "@/server/db/client";

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
    },
  });

  return user;
}

export async function requireUser(allowedRoles?: UserRole[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(getAuthPathForRole(allowedRoles?.[0]));
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect(getPathForRole(user.role));
  }

  return user;
}

export async function redirectAuthenticatedUser() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getPathForRole(user.role));
  }
}

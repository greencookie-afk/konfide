import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};

export function getPathForRole(role: UserRole) {
  if (role === "LISTENER") {
    return "/listener/dashboard";
  }

  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  return "/explore";
}

export function getAuthPathForRole(role?: UserRole) {
  if (role === "LISTENER") {
    return "/auth?mode=signin&role=listen";
  }

  return "/auth?mode=signin&role=talk";
}

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

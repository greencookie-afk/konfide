import type { UserRole } from "@/generated/prisma";

export function getPathForRole(role: UserRole) {
  if (role === "LISTENER") {
    return "/listener/dashboard";
  }

  return "/explore";
}

export function getAuthPathForRole(role?: UserRole) {
  if (role === "LISTENER") {
    return "/auth?mode=signin&role=listen";
  }

  return "/auth?mode=signin&role=talk";
}

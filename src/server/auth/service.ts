import "server-only";
import { NextResponse } from "next/server";
import type { UserRole } from "@/generated/prisma";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { clearSessionCookie, setSessionCookie, verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { prisma } from "@/server/db/client";

type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
};

export type AuthPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

function authJson(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function parseRole(role: string | undefined): UserRole | null {
  if (role === "talk") {
    return "TALKER";
  }

  if (role === "listen") {
    return "LISTENER";
  }

  return null;
}

export function sanitizeUser(user: PublicUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };
}

export function validateAuthPayload(payload: AuthPayload, isSignUp: boolean) {
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password ?? "";
  const name = payload.name?.trim();
  const role = parseRole(payload.role);

  if (!role) {
    return { error: "Choose whether you need to talk or want to listen." };
  }

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (isSignUp && !name) {
    return { error: "Enter your full name." };
  }

  return {
    data: {
      email,
      password,
      name: name || null,
      role,
    },
  };
}

export async function createAuthSuccessResponse(user: PublicUser) {
  const response = authJson({ user: sanitizeUser(user) });
  setSessionCookie(response, {
    userId: user.id,
    role: user.role,
  });
  return response;
}

export async function signUpUser(payload: AuthPayload) {
  const validation = validateAuthPayload(payload, true);

  if ("error" in validation) {
    return authJson({ error: validation.error }, 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: validation.data.email },
  });

  if (existingUser) {
    return authJson({ error: "An account with that email already exists." }, 409);
  }

  const user = await prisma.user.create({
    data: {
      name: validation.data.name,
      email: validation.data.email,
      emailVerified: false,
      passwordHash: await hashPassword(validation.data.password),
      role: validation.data.role,
    },
  });

  return createAuthSuccessResponse(user);
}

export async function signInUser(payload: AuthPayload) {
  const validation = validateAuthPayload(payload, false);

  if ("error" in validation) {
    return authJson({ error: validation.error }, 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: validation.data.email },
  });

  if (!user) {
    return authJson({ error: "Invalid email, password, or role selection." }, 401);
  }

  const isValidPassword = user.passwordHash
    ? await verifyPassword(validation.data.password, user.passwordHash)
    : false;

  if (!isValidPassword || user.role !== validation.data.role) {
    return authJson({ error: "Invalid email, password, or role selection." }, 401);
  }

  return createAuthSuccessResponse(user);
}

export async function getSessionUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

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

export async function signOutUser() {
  const response = authJson({ success: true });
  clearSessionCookie(response);
  return response;
}

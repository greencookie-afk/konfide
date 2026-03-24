import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { UserRole } from "@/generated/prisma/client";

export const SESSION_COOKIE_NAME = "konfide_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  role: UserRole;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSignedToken<T extends Record<string, unknown>>(payload: T, ttlSeconds = SESSION_TTL_SECONDS) {
  const value = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySignedToken<T extends { exp: number }>(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as T;

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(session: Omit<SessionPayload, "exp">) {
  return createSignedToken(session, SESSION_TTL_SECONDS);
}

export function verifySessionToken(token: string | undefined) {
  return verifySignedToken<SessionPayload>(token);
}

export function setSessionCookie(response: NextResponse, session: Omit<SessionPayload, "exp">) {
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    priority: "high",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    priority: "high",
    path: "/",
    maxAge: 0,
  });
}

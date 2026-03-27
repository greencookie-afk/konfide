import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { enforceRateLimit, getRequestFingerprint } from "@/server/auth/rate-limit";
import { signUpUser } from "@/server/auth/service";

function isSchemaMismatchError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

function isDatabaseUnavailableError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1001";
}

function isDatabaseConfigurationError(error: unknown) {
  return error instanceof Error && error.message.includes("hosted Postgres database");
}

export async function POST(request: Request) {
  try {
    let payload: Record<string, string | undefined>;

    try {
      payload = (await request.json()) as Record<string, string | undefined>;
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "unknown-email";
    const rateLimit = await enforceRateLimit("signup", `${getRequestFingerprint(request)}:${email}`, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    return signUpUser(payload);
  } catch (error) {
    if (isSchemaMismatchError(error)) {
      return NextResponse.json(
        { error: "Your database schema is out of date for auth. Run `npx prisma db push`, then restart `npm run dev`." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (isDatabaseUnavailableError(error) || isDatabaseConfigurationError(error)) {
      return NextResponse.json(
        { error: "Authentication is temporarily unavailable because the database connection is not ready yet." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    console.error("Signup failed:", error);
    return NextResponse.json(
      { error: "We couldn't complete signup right now. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

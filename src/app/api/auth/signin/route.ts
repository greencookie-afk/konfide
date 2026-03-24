import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { enforceRateLimit, getRequestFingerprint } from "@/lib/auth/rate-limit";
import { signInUser } from "@/lib/auth/shared";

function isSchemaMismatchError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
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
    const rateLimit = await enforceRateLimit("signin", `${getRequestFingerprint(request)}:${email}`, 10, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    return signInUser(payload);
  } catch (error) {
    if (isSchemaMismatchError(error)) {
      return NextResponse.json(
        { error: "Your database schema is out of date for auth. Run `npx prisma db push`, then restart `npm run dev`." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    console.error("Signin failed:", error);
    return NextResponse.json(
      { error: "We couldn't complete sign-in right now. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

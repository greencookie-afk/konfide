import { NextResponse } from "next/server";
import { startGoogleAuth } from "@/server/auth/google";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const role = requestUrl.searchParams.get("role") === "listen" ? "listen" : "talk";
  const mode = requestUrl.searchParams.get("mode") === "signup" ? "signup" : "signin";

  try {
    return await startGoogleAuth(request);
  } catch (error) {
    const isMissingConfig =
      error instanceof Error &&
      (error.message.includes("GOOGLE_CLIENT_ID") || error.message.includes("GOOGLE_CLIENT_SECRET"));
    const url = new URL("/auth", request.url);
    const details = error instanceof Error ? error.message : "Unknown error";

    console.error("Google auth start failed:", error);
    url.searchParams.set("mode", mode);
    url.searchParams.set("role", role);
    url.searchParams.set("error", isMissingConfig ? "google_not_configured" : "google_start_failed");

    if (!isMissingConfig && process.env.NODE_ENV !== "production") {
      url.searchParams.set("details", details.slice(0, 220));
    }

    return NextResponse.redirect(url, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}

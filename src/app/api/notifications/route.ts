import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { getNavbarNotifications } from "@/server/notifications/service";

export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before loading notifications.", 401);
  }

  const notifications = await getNavbarNotifications(user.id, user.role);

  return NextResponse.json(notifications, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

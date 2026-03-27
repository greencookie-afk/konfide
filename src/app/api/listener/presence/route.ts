import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { markListenerAway, touchListenerPresence } from "@/server/availability/service";
import { getUntrustedOriginMessage, isTrustedMutationOrigin } from "@/server/security/origin";

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

export async function POST(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return jsonError(getUntrustedOriginMessage(), 403);
  }

  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before syncing listener presence.", 401);
  }

  if (user.role !== "LISTENER") {
    return jsonError("Only listener accounts can sync presence.", 403);
  }

  let payload: {
    action?: "heartbeat" | "away";
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid listener presence request.", 400);
  }

  if (payload.action === "away") {
    await markListenerAway(user.id);
  } else {
    await touchListenerPresence(user.id);
  }

  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

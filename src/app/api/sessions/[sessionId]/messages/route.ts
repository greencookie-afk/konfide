import { NextResponse } from "next/server";
import { enforceRateLimit, getRequestFingerprint } from "@/server/auth/rate-limit";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { createSessionChatMessage, getSessionChatStateForUser } from "@/server/chat/service";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before opening this chat.", 401);
  }

  const { sessionId } = await params;
  const state = await getSessionChatStateForUser(sessionId, user.id);

  if (!state) {
    return jsonError("That session chat was not found.", 404);
  }

  return NextResponse.json(state, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  if (!isTrustedMutationOrigin(request)) {
    return jsonError(getUntrustedOriginMessage(), 403);
  }

  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before sending a session message.", 401);
  }

  let payload: { body?: string };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid chat request.", 400);
  }

  if (typeof payload.body !== "string") {
    return jsonError("Write a message before sending.", 400);
  }

  try {
    const { sessionId } = await params;
    const rateLimit = await enforceRateLimit(
      "chat-message",
      `${getRequestFingerprint(request)}:${user.id}:${sessionId}`,
      45,
      60 * 1000
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many messages sent too quickly. Please slow down for a moment." },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const created = await createSessionChatMessage({
      sessionId,
      userId: user.id,
      body: payload.body,
    });

    return NextResponse.json(created, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "We could not send that message.", 400);
  }
}

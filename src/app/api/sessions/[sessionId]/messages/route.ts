import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { createSessionChatMessage, getSessionChatStateForUser } from "@/server/chat/service";

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

  try {
    const { sessionId } = await params;
    const created = await createSessionChatMessage({
      sessionId,
      userId: user.id,
      body: payload.body ?? "",
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

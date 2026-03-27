import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { enforceRateLimit, getRequestFingerprint } from "@/server/auth/rate-limit";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { getUntrustedOriginMessage, isTrustedMutationOrigin } from "@/server/security/origin";
import { createConversationRequest } from "@/server/sessions/service";

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
    return jsonError("Sign in before sending a request.", 401);
  }

  if (user.role !== "TALKER") {
    return jsonError("Only talker accounts can send a request.", 403);
  }

  const rateLimit = await enforceRateLimit(
    "conversation-request",
    `${getRequestFingerprint(request)}:${user.id}`,
    12,
    10 * 60 * 1000
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many chat requests sent too quickly. Please try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  let payload: {
    listenerSlug?: string;
    topic?: string;
    notes?: string;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  if (typeof payload.listenerSlug !== "string" || !payload.listenerSlug.trim()) {
    return jsonError("Choose a listener before sending a request.", 400);
  }

  if (payload.topic !== undefined && typeof payload.topic !== "string") {
    return jsonError("Topic must be plain text.", 400);
  }

  if (payload.notes !== undefined && typeof payload.notes !== "string") {
    return jsonError("Context must be plain text.", 400);
  }

  try {
    const conversation = await createConversationRequest({
      talkerId: user.id,
      listenerSlug: payload.listenerSlug,
      topic: payload.topic,
      notes: payload.notes,
    });

    const listenerSlug = payload.listenerSlug.trim();

    revalidatePath("/explore");
    revalidatePath("/sessions");
    revalidatePath("/listener/dashboard");
    revalidatePath("/listener/availability");
    revalidatePath("/listener/sessions");
    revalidatePath(`/sessions/${conversation.id}`);
    revalidatePath(`/sessions/${conversation.id}/chat`);
    revalidatePath(`/listener/sessions/${conversation.id}`);
    revalidatePath(`/listener/sessions/${conversation.id}/chat`);
    revalidatePath(`/explore/${listenerSlug}`);
    revalidatePath(`/explore/${listenerSlug}/book`);
    revalidatePath(`/explore/${listenerSlug}/connect`);

    return NextResponse.json(
      {
        requestId: conversation.id,
        sessionId: conversation.id,
        bookingId: conversation.id,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "We could not send that request.", 400);
  }
}

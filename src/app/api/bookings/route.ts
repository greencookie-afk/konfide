import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
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
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before sending a request.", 401);
  }

  if (user.role !== "TALKER") {
    return jsonError("Only talker accounts can send a request.", 403);
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

  try {
    const booking = await createConversationRequest({
      talkerId: user.id,
      listenerSlug: payload.listenerSlug ?? "",
      topic: payload.topic,
      notes: payload.notes,
    });

    const listenerSlug = payload.listenerSlug?.trim();

    revalidatePath("/explore");
    revalidatePath("/sessions");
    revalidatePath("/listener/dashboard");
    revalidatePath("/listener/availability");
    revalidatePath("/listener/sessions");
    revalidatePath(`/sessions/${booking.id}`);
    revalidatePath(`/sessions/${booking.id}/chat`);
    revalidatePath(`/listener/sessions/${booking.id}`);
    revalidatePath(`/listener/sessions/${booking.id}/chat`);

    if (listenerSlug) {
      revalidatePath(`/explore/${listenerSlug}`);
      revalidatePath(`/explore/${listenerSlug}/book`);
      revalidatePath(`/explore/${listenerSlug}/connect`);
    }

    return NextResponse.json(
      { bookingId: booking.id },
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

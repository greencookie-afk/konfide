import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { createSessionBooking } from "@/server/sessions/service";

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
    return jsonError("Sign in before booking a session.", 401);
  }

  if (user.role !== "TALKER") {
    return jsonError("Only user accounts can book a session.", 403);
  }

  let payload: {
    listenerSlug?: string;
    scheduledAtIso?: string;
    durationMinutes?: number;
    topic?: string;
    notes?: string;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid booking request.", 400);
  }

  try {
    const booking = await createSessionBooking({
      talkerId: user.id,
      listenerSlug: payload.listenerSlug ?? "",
      scheduledAtIso: payload.scheduledAtIso ?? "",
      durationMinutes: Number(payload.durationMinutes ?? 0),
      topic: payload.topic,
      notes: payload.notes,
    });

    return NextResponse.json(
      { bookingId: booking.id },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "We could not create that booking.", 400);
  }
}

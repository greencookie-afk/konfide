import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { replaceListenerAvailability } from "@/server/availability/service";

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

export async function PUT(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before editing availability.", 401);
  }

  if (user.role !== "LISTENER") {
    return jsonError("Only listener accounts can edit availability.", 403);
  }

  let payload: {
    timezone?: string;
    defaultSessionMinutes?: number;
    bufferMinutes?: number;
    acceptingNewBookings?: boolean;
    slots?: Array<{
      dayOfWeek: number;
      startMinute: number;
      endMinute: number;
    }>;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid availability request.", 400);
  }

  try {
    await replaceListenerAvailability(user.id, payload);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "We could not save availability.", 400);
  }
}

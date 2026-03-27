import { revalidatePath } from "next/cache";
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
    acceptingNewBookings?: boolean;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid availability request.", 400);
  }

  if (typeof payload.acceptingNewBookings !== "boolean") {
    return jsonError("Choose whether requests should be on or off.", 400);
  }

  try {
    await replaceListenerAvailability(user.id, payload);
    revalidatePath("/explore");
    revalidatePath("/listener/availability");
    revalidatePath("/listener/dashboard");
    revalidatePath("/listener/sessions");

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

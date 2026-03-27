import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { acceptConversationRequest } from "@/server/sessions/service";

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before accepting a request.", 401);
  }

  if (user.role !== "LISTENER") {
    return jsonError("Only listener accounts can accept a request.", 403);
  }

  try {
    const { sessionId } = await params;
    await acceptConversationRequest(user.id, sessionId);

    revalidatePath("/sessions");
    revalidatePath("/listener/dashboard");
    revalidatePath("/listener/sessions");
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath(`/sessions/${sessionId}/chat`);
    revalidatePath(`/listener/sessions/${sessionId}`);
    revalidatePath(`/listener/sessions/${sessionId}/chat`);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "We could not accept that request.", 400);
  }
}

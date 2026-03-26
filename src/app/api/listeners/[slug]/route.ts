import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { getListenerProfile } from "@/server/listeners/service";

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

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Authentication required.", 401);
  }

  if (user.role === "LISTENER") {
    return jsonError("Listener profiles are only available to user accounts.", 403);
  }

  const { slug } = await context.params;
  const listener = await getListenerProfile(slug);

  if (!listener) {
    return jsonError("Listener not found.", 404);
  }

  return NextResponse.json(listener, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

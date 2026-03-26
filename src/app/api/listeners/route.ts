import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { getBrowseListeners, normalizeBrowseListenersInput } from "@/server/listeners/service";

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

export async function GET(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Authentication required.", 401);
  }

  if (user.role === "LISTENER") {
    return jsonError("Listener browsing is only available to user accounts.", 403);
  }

  const searchParams = request.nextUrl.searchParams;
  const result = await getBrowseListeners(
    normalizeBrowseListenersInput({
      page: searchParams.get("page"),
      q: searchParams.get("q"),
      topic: searchParams.get("topic"),
      sort: searchParams.get("sort"),
    })
  );

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

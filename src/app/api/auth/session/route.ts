import { NextResponse } from "next/server";
import { getSessionUserFromRequest, sanitizeUser, signOutUser } from "@/server/auth/service";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { user: sanitizeUser(user) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE() {
  return signOutUser();
}

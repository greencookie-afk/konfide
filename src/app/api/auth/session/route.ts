import { NextResponse } from "next/server";
import { sanitizeUser, signOutUser } from "@/lib/auth/shared";
import { getCurrentUser } from "@/lib/auth/server";

export async function GET() {
  const user = await getCurrentUser();

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

import { NextResponse } from "next/server";
import { getSessionUserFromRequest, sanitizeUser, signOutUser } from "@/server/auth/service";
import { getUntrustedOriginMessage, isTrustedMutationOrigin } from "@/server/security/origin";

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

export async function DELETE(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return NextResponse.json(
      { error: getUntrustedOriginMessage() },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  return signOutUser();
}

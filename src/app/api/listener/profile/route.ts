import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { getUntrustedOriginMessage, isTrustedMutationOrigin } from "@/server/security/origin";
import { saveListenerProfile } from "@/server/listeners/service";

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

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export async function PUT(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return jsonError(getUntrustedOriginMessage(), 403);
  }

  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before editing your public profile.", 401);
  }

  if (user.role !== "LISTENER") {
    return jsonError("Only listener accounts can edit listener profiles.", 403);
  }

  let payload: {
    slug?: string;
    headline?: string;
    about?: string;
    specialties?: string[];
    languages?: string[];
    isPublished?: boolean;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid profile request.", 400);
  }

  if (payload.slug !== undefined && typeof payload.slug !== "string") {
    return jsonError("Slug must be plain text.", 400);
  }

  if (payload.headline !== undefined && typeof payload.headline !== "string") {
    return jsonError("Headline must be plain text.", 400);
  }

  if (payload.about !== undefined && typeof payload.about !== "string") {
    return jsonError("About text must be plain text.", 400);
  }

  if (payload.specialties !== undefined && !isStringArray(payload.specialties)) {
    return jsonError("Specialties must be a list of text values.", 400);
  }

  if (payload.languages !== undefined && !isStringArray(payload.languages)) {
    return jsonError("Languages must be a list of text values.", 400);
  }

  if (payload.isPublished !== undefined && typeof payload.isPublished !== "boolean") {
    return jsonError("Publish state must be true or false.", 400);
  }

  try {
    await saveListenerProfile(user.id, payload);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "We could not save your profile.", 400);
  }
}

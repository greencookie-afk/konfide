import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/server/auth/service";
import { updateAccountEditorData } from "@/server/account/service";
import { getUntrustedOriginMessage, isTrustedMutationOrigin } from "@/server/security/origin";

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
  if (!isTrustedMutationOrigin(request)) {
    return jsonError(getUntrustedOriginMessage(), 403);
  }

  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return jsonError("Sign in before editing your profile.", 401);
  }

  let payload: {
    name?: string;
    browserNotificationsEnabled?: boolean;
    browserNotificationPermission?: string | null;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return jsonError("Invalid profile request.", 400);
  }

  if (payload.name !== undefined && typeof payload.name !== "string") {
    return jsonError("Display name must be plain text.", 400);
  }

  if (
    payload.browserNotificationsEnabled !== undefined &&
    typeof payload.browserNotificationsEnabled !== "boolean"
  ) {
    return jsonError("Notification preference must be true or false.", 400);
  }

  if (
    payload.browserNotificationPermission !== undefined &&
    payload.browserNotificationPermission !== null &&
    typeof payload.browserNotificationPermission !== "string"
  ) {
    return jsonError("Notification permission must be a text value.", 400);
  }

  try {
    await updateAccountEditorData(user.id, payload);

    revalidatePath("/account");
    revalidatePath("/listener/dashboard");
    revalidatePath("/listener/profile");
    revalidatePath("/listener/availability");

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

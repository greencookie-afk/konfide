import "server-only";
import { prisma } from "@/server/db/client";

export type AccountEditorData = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "TALKER" | "LISTENER" | "ADMIN";
  browserNotificationsEnabled: boolean;
  browserNotificationPermission: string | null;
};

export async function getAccountEditorData(userId: string): Promise<AccountEditorData | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      browserNotificationsEnabled: true,
      browserNotificationPermission: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    browserNotificationsEnabled: user.browserNotificationsEnabled,
    browserNotificationPermission: user.browserNotificationPermission,
  };
}

export async function updateAccountEditorData(
  userId: string,
  input: {
    name?: string;
    browserNotificationsEnabled?: boolean;
    browserNotificationPermission?: string | null;
  }
) {
  const updateData: {
    name?: string;
    browserNotificationsEnabled?: boolean;
    browserNotificationPermission?: string | null;
  } = {};

  if (Object.prototype.hasOwnProperty.call(input, "name")) {
    const name = input.name?.trim() ?? "";

    if (!name) {
      throw new Error("Enter a display name before saving.");
    }

    if (name.length > 60) {
      throw new Error("Keep your display name under 60 characters.");
    }

    updateData.name = name;
  }

  if (Object.prototype.hasOwnProperty.call(input, "browserNotificationsEnabled")) {
    updateData.browserNotificationsEnabled = Boolean(input.browserNotificationsEnabled);
  }

  if (Object.prototype.hasOwnProperty.call(input, "browserNotificationPermission")) {
    const permission = input.browserNotificationPermission;

    if (permission && !["default", "granted", "denied"].includes(permission)) {
      throw new Error("Invalid browser notification permission value.");
    }

    updateData.browserNotificationPermission = permission ?? null;
  }

  if (!Object.keys(updateData).length) {
    throw new Error("Nothing to update.");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });
}

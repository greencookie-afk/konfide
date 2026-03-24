import { prisma } from "@/lib/prisma";

export function getRequestFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") || "unknown-agent";
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown-ip";

  return `${ip}:${userAgent}`;
}

export async function enforceRateLimit(action: string, key: string, limit: number, windowMs: number) {
  const now = new Date();
  const bucketStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const expiresAt = new Date(bucketStart.getTime() + windowMs);

  await prisma.authRateLimitBucket.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  const bucket = await prisma.authRateLimitBucket.upsert({
    where: {
      action_key_windowStart: {
        action,
        key,
        windowStart: bucketStart,
      },
    },
    create: {
      action,
      key,
      windowStart: bucketStart,
      expiresAt,
      count: 1,
    },
    update: {
      count: {
        increment: 1,
      },
      expiresAt,
    },
  });

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)),
  };
}

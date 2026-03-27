import "server-only";
import { resolveAppUrl } from "@/server/shared/app-url";

function normalizeOrigin(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isTrustedMutationOrigin(request: Request) {
  const origin = normalizeOrigin(request.headers.get("origin"));

  if (!origin) {
    return request.headers.get("sec-fetch-site") !== "cross-site";
  }

  const trustedOrigins = new Set<string>([
    normalizeOrigin(request.url),
    normalizeOrigin(resolveAppUrl()),
  ].filter((value): value is string => Boolean(value)));

  return trustedOrigins.has(origin);
}

export function getUntrustedOriginMessage() {
  return "This request came from an untrusted origin.";
}

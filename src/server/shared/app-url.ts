import "server-only";

function normalizeUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function resolveAppUrl() {
  return (
    normalizeUrl(process.env.APP_URL) ||
    normalizeUrl(process.env.NEXTAUTH_URL) ||
    normalizeUrl(process.env.VERCEL_URL) ||
    normalizeUrl(process.env.VERCEL_BRANCH_URL) ||
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    "http://localhost:3000"
  );
}

import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

function getConfiguredDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return databaseUrl;
}

function resolveConnectionString(databaseUrl: string) {
  if (databaseUrl.startsWith("prisma+postgres://")) {
    const url = new URL(databaseUrl);
    const apiKey = url.searchParams.get("api_key");

    if (!apiKey) {
      throw new Error("Prisma Postgres URL is missing its api_key parameter.");
    }

    const decoded = JSON.parse(Buffer.from(apiKey, "base64url").toString("utf8")) as {
      databaseUrl?: string;
    };

    if (!decoded.databaseUrl) {
      throw new Error("Unable to resolve the direct Postgres connection string from DATABASE_URL.");
    }

    return decoded.databaseUrl;
  }

  return databaseUrl;
}

function assertHostedConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);

    if (process.env.VERCEL === "1" && LOCAL_DATABASE_HOSTS.has(url.hostname)) {
      throw new Error(
        "Production DATABASE_URL points to localhost. Configure a hosted Postgres database before deploying to Vercel."
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("hosted Postgres")) {
      throw error;
    }
  }

  return connectionString;
}

function getConnectionString() {
  return assertHostedConnectionString(resolveConnectionString(getConfiguredDatabaseUrl()));
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: getConnectionString() }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

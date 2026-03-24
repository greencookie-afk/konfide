import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function getConnectionString() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

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

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: getConnectionString() }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

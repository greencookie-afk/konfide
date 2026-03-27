import "server-only";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/server/db/client";
import type { BrowseListenersFilters } from "@/server/listeners/types";

function buildBrowseWhere(filters: Pick<BrowseListenersFilters, "query" | "topic">): Prisma.ListenerProfileWhereInput {
  const conditions: Prisma.ListenerProfileWhereInput[] = [
    {
      isPublished: true,
    },
    {
      user: {
        is: {
          role: "LISTENER",
          listenerSettings: {
            is: {
              acceptingNewBookings: true,
            },
          },
        },
      },
    },
  ];

  if (filters.query) {
    conditions.push({
      OR: [
        {
          user: {
            is: {
              name: {
                contains: filters.query,
                mode: "insensitive",
              },
            },
          },
        },
        {
          headline: {
            contains: filters.query,
            mode: "insensitive",
          },
        },
        {
          about: {
            contains: filters.query,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (filters.topic) {
    conditions.push({
      specialties: {
        has: filters.topic,
      },
    });
  }

  return conditions.length === 1 ? conditions[0] : { AND: conditions };
}

export async function listPublishedListenerProfiles(filters: BrowseListenersFilters) {
  return prisma.listenerProfile.findMany({
    where: buildBrowseWhere(filters),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          listenerSettings: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function countPublishedListenerProfiles(filters: Pick<BrowseListenersFilters, "query" | "topic">) {
  return prisma.listenerProfile.count({
    where: buildBrowseWhere(filters),
  });
}

export async function listListenerTopics() {
  const profiles = await prisma.listenerProfile.findMany({
    where: {
      isPublished: true,
      user: {
        is: {
          role: "LISTENER",
          listenerSettings: {
            is: {
              acceptingNewBookings: true,
            },
          },
        },
      },
    },
    select: {
      specialties: true,
    },
  });

  return [...new Set(profiles.flatMap((profile) => profile.specialties))].sort((left, right) =>
    left.localeCompare(right)
  );
}

export async function findPublishedListenerBySlug(slug: string) {
  return prisma.listenerProfile.findFirst({
    where: {
      slug,
      isPublished: true,
      user: {
        is: {
          role: "LISTENER",
          listenerSettings: {
            is: {
              acceptingNewBookings: true,
            },
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          listenerSettings: true,
        },
      },
    },
  });
}

export async function findListenerProfileByUserId(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      avatarUrl: true,
      listenerSettings: {
        select: {
          acceptingNewBookings: true,
        },
      },
      listenerProfile: true,
    },
  });
}

export async function upsertListenerProfile(
  userId: string,
  data: {
    slug: string;
    headline: string | null;
    about: string | null;
    specialties: string[];
    languages: string[];
    isPublished: boolean;
  }
) {
  return prisma.listenerProfile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      slug: data.slug,
      headline: data.headline,
      about: data.about,
      specialties: data.specialties,
      languages: data.languages,
      isPublished: data.isPublished,
    },
    update: {
      slug: data.slug,
      headline: data.headline,
      about: data.about,
      specialties: data.specialties,
      languages: data.languages,
      isPublished: data.isPublished,
    },
  });
}

export async function isListenerSlugTaken(slug: string, userId: string) {
  const existing = await prisma.listenerProfile.findFirst({
    where: {
      slug,
      userId: {
        not: userId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(existing);
}

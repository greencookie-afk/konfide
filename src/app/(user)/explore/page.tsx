import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ExploreCatalog from "@/features/explore/components/ExploreCatalog";
import { getBrowseListeners, normalizeBrowseListenersInput } from "@/server/listeners/service";

type ExplorePageSearchParams = Promise<{
  page?: string | string[];
  q?: string | string[];
  topic?: string | string[];
  sort?: string | string[];
}>;

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ExploreListenersPage({
  searchParams,
}: {
  searchParams: ExplorePageSearchParams;
}) {
  const params = await searchParams;
  const filters = normalizeBrowseListenersInput({
    page: readParam(params.page) ?? null,
    q: readParam(params.q) ?? null,
    topic: readParam(params.topic) ?? null,
    sort: readParam(params.sort) ?? null,
  });
  const browseResult = await getBrowseListeners(filters);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:px-8">
        <ExploreCatalog browseResult={browseResult} />
      </main>

      <Footer />
    </div>
  );
}

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type Params = Promise<{
  slug?: string[];
}>;

export default async function FilteredNotesPage({
  params,
}: {
  params: Params;
}) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0];
  const activeTag = tag === "all" ? undefined : tag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes(1, "", 12, activeTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={activeTag} />
    </HydrationBoundary>
  );
}
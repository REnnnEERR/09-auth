import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import FilterNotesClient from "./Notes.client";

type Params = {
  params: {
    slug?: string[];
  };
};

export async function generateMetadata(
  { params }: Params
): Promise<Metadata> {
  const tag = params.slug?.[0] ?? "all";

  return {
    title: `Notes (${tag}) | NoteHub`,
    description: `Notes filtered by tag: ${tag}`,
    openGraph: {
      title: `Notes (${tag}) | NoteHub`,
      description: `Notes filtered by tag: ${tag}`,
      url: `https://notehub.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Notes filter",
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Params) {
  const queryClient = new QueryClient();
  const tag = params.slug?.[0];

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes(1, "", 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilterNotesClient tag={tag} />
    </HydrationBoundary>
  );
}
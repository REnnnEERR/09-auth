import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import FilterNotesClient from "./Notes.client";

export async function generateMetadata(
  params: Promise<{ slug?: string[] }>
): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

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

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug?.[0] === "all" ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
  queryKey: ["notes", 1, "", tag],
  queryFn: () => fetchNotes({ page: 1, search: "", perPage: 12, tag }),
});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilterNotesClient tag={tag} />
    </HydrationBoundary>
  );
}

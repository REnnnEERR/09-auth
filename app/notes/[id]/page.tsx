import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(
  params: Promise<{ id: string }>
): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 100),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 100),
      url: `https://notehub.vercel.app/notes/${note.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  return <NoteDetailsClient id={id} />;
}
import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const note = await fetchNoteById(params.id);

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

export default function NotePage({ params }: Props) {
  return <NoteDetailsClient id={params.id} />;
}
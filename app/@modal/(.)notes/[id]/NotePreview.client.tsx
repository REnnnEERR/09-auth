"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { NotePreview } from "@/components/NotePreview/NotePreview";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Failed to load note.</p>;

  return <NotePreview note={data} />;
}

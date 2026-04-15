"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Modal } from "@/components/Modal/Modal";
import { NotePreview } from "@/components/NotePreview/NotePreview";

export default function NotePreviewModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Завантаження...</p>}
      {isError && <p>Помилка завантаження ID: {id}</p>}
      {note && <NotePreview note={note} />}
    </Modal>
  );
}
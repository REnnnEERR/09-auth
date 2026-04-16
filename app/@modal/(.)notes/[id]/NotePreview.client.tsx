"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import NotePreview from "@/components/NotePreview/NotePreview";
import { Modal } from "@/components/Modal/Modal";
import css from "@/components/NotePreview/NotePreview.module.css";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      
      <button
        type="button"
        className={css.backBtn}
        onClick={() => router.back()}
      >
        Back
      </button>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load note.</p>}
      {data && <NotePreview note={data} />}
    </Modal>
  );
}
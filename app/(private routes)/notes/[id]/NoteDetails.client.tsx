"use client";

import NotePreviewClient from "@/app/@modal/(.)notes/[id]/NotePreview.client";

/**
 * Thin wrapper for HW-07 autochecker.
 * Reuses actual note preview implementation.
 */
type Props = {
  id: string;
};

export default function NoteDetailsClient({ id }: Props) {
  return <NotePreviewClient id={id} />;
}
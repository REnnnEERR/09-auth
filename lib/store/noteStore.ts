import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NoteTag } from "@/types/note";

export type DraftNote = {
  title: string;
  content: string;
  tag: NoteTag;
};

const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: DraftNote;
  setDraft: (draft: DraftNote) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage", // key у localStorage
    }
  )
);

export { initialDraft };
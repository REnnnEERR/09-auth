import { Note } from "@/types/note";
import css from "./NotePreview.module.css";

type Props = {
  note: Note;
};

export default function NotePreview({ note }: Props) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <div className={css.content}>{note.content}</div>

        <div className={css.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
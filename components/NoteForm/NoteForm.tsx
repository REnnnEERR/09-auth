"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { NoteTag } from "@/types/note"; // Переконайся, що цей шлях вірний
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Описуємо структуру значень форми для Formik
interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3, "Too short"),
  content: Yup.string().required("Content is required").min(10, "Too short"),
  tag: Yup.string()
    .oneOf(["Work", "Personal", "Study"], "Invalid tag")
    .required("Tag is required"),
});

const NoteForm = ({ onCancel, onSuccess }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // Оновлюємо кеш нотаток
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // Викликаємо пропс для закриття модалки
      onSuccess();
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      content: "",
      tag: "Personal" as NoteTag, // Явно кажемо, що це наш тип
    },
    validationSchema,
    onSubmit: (values) => {
      // Тепер тут не треба ніяких "as any", бо типи збігаються
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      <div className={css.field}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          {...formik.getFieldProps("title")}
          className={formik.touched.title && formik.errors.title ? css.inputError : ""}
        />
        {formik.touched.title && formik.errors.title && (
          <div className={css.error}>{formik.errors.title}</div>
        )}
      </div>

      <div className={css.field}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          {...formik.getFieldProps("content")}
          className={formik.touched.content && formik.errors.content ? css.inputError : ""}
        />
        {formik.touched.content && formik.errors.content && (
          <div className={css.error}>{formik.errors.content}</div>
        )}
      </div>

      <div className={css.field}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" {...formik.getFieldProps("tag")}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={onCancel} className={css.cancelBtn}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className={css.submitBtn}
        >
          {mutation.isPending ? "Saving..." : "Save Note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
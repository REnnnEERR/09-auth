"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "@/app/(private routes)/notes/Notes.module.css";

type Props = {
  tag?: string;
};

export default function FilterNotesClient({ tag }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, debouncedSearch, 12, tag),
    placeholderData: keepPreviousData,
  });

  return (
    <section className={css.container}>
      <div className={css.controls}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        <Link href="/notes/action/create" className={css.addButton}>
          Add New Note
        </Link>
      </div>

      {isLoading ? (
        <p>Loading notes...</p>
      ) : (
        <>
          <NoteList notes={data?.notes ?? []} />
          <Pagination
            currentPage={page}
            pageCount={data?.totalPages ?? 1}
            onPageChange={(e) => setPage(e.selected + 1)}
          />
        </>
      )}
    </section>
  );
}
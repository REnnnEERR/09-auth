"use client";

import { useState, useEffect} from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "@/app/(private routes)/notes/Notes.module.css";
import Link from "next/link";


type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
  if (page !== 1) {  
    setPage(1);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, debouncedSearch, 12, tag),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected);
  };

  return (
    <main className={css.mainContent}>
      <SearchBox value={search} onChange={setSearch} />

      {isLoading && <p>Loading...</p>}
      
<Link href="/notes/action/create" className={css.createLink}>
  Create note
</Link>

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />

          <Pagination
            pageCount={data.totalPages}
            currentPage={page}         
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

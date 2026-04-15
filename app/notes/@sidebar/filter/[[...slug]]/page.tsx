import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from '@/app/notes/Notes.client';

// Визначаємо тип параметрів чітко за специфікацією Next.js 15
type Params = Promise<{ slug?: string[] }>;

export default async function FilteredNotesPage(props: { params: Params }) {
  const queryClient = new QueryClient();
  
  // Розпаковуємо параметри
  const { slug } = await props.params;
  const tag = slug?.[0];
  const activeTag = tag === 'all' ? undefined : tag;

  // SSR предфетчинг
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', activeTag],
    queryFn: () => fetchNotes(1, '', 12, activeTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Передаємо проміс у клієнт */}
      <NotesClient params={props.params} />
    </HydrationBoundary>
  );
}
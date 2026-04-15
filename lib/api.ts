import axios from 'axios';
import { FetchNotesResponse, Note } from '@/types/note';

const getApi = () => {
  return axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
  });
};

export const fetchNotes = async (
  page: number = 1,
  search: string = '',
  perPage: number = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const response = await getApi().get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await getApi().get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const response = await getApi().post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await getApi().delete(`/notes/${id}`);
};
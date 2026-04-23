import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import { api } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { Note, FetchNotesResponse } from "@/types/note";

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");
};

export const checkSession = async (): Promise<AxiosResponse<User | null> | null> => {
  try {
    const cookieHeader = await getCookieHeader();
    return await api.get<User | null>("/auth/session", {
      headers: {
        Cookie: cookieHeader,  
      },
    });
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    await getCookieHeader();
    const res = await api.get<User>("/users/me");
    return res.data;
  } catch {
    return null;
  }
};

export const fetchNotes = async (
  page = 1,
  search = "",
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  await getCookieHeader();
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: { page, search, perPage, ...(tag ? { tag } : {}) },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  await getCookieHeader();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};
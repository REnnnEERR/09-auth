import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import { api } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { Note, FetchNotesResponse } from "@/types/note";

const attachCookies = async () => {
  const cookieStore = await cookies(); // ✅ await
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  api.defaults.headers.Cookie = cookieHeader;
};

export const checkSession = async (): Promise<AxiosResponse<User | null> | null> => {
  try {
    await attachCookies();
    return await api.get<User | null>("/auth/session");
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    await attachCookies();
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
  await attachCookies();
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: { page, search, perPage, ...(tag ? { tag } : {}) },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  await attachCookies();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};
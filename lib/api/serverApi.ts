import { cookies } from "next/headers";
import { api } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const getMe = async (): Promise<User> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookie },
  });
  return data;
};

export const fetchNotes = async (params: object = {}): Promise<Note[]> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<Note[]>("/notes", {
    params,
    headers: { Cookie: cookie },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookie },
  });
  return data;
};

export const checkSession = async () => {
  const cookie = await getCookieHeader();
  return api.get("/auth/session", {
    headers: { Cookie: cookie },
  });
};
import axios from "axios";
import { cookies } from "next/headers";
import type { Note, FetchNotesResponse } from "@/types/note";
import type { User } from "@/types/user";

/**
 * Creates axios instance for server-side requests.
 * Cookies must be awaited and forwarded manually.
 */
const createServerApi = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

/* =========================
   AUTH / USER
========================= */

export const checkSession = async (): Promise<User | null> => {
  try {
    const api = await createServerApi();
    const response = await api.get<User | null>("/auth/session");
    return response.data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const api = await createServerApi();
    const response = await api.get<User>("/users/me");
    return response.data;
  } catch {
    return null;
  }
};

/* =========================
   NOTES
========================= */

export const fetchNotes = async (
  page = 1,
  search = "",
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const api = await createServerApi();

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search,
      perPage,
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = await createServerApi();
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};
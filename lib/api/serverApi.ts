import axios, { type AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note, FetchNotesResponse } from "@/types/note";

const createServerApi = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
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

export const checkSession = async (): Promise<AxiosResponse<User | null> | null> => {
  try {
    const api = await createServerApi();
    return await api.get<User | null>("/auth/session");
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const api = await createServerApi();
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
  const api = await createServerApi();
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search,
      perPage,
      ...(tag ? { tag } : {}),
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = await createServerApi();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

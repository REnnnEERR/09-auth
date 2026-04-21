import { api } from "./api";
import type { Note, FetchNotesResponse } from "@/types/note";
import type { User } from "@/types/user";

// AUTH

interface AuthCredentials {
  email: string;
  password: string;
}

export const register = async (
  data: AuthCredentials
): Promise<User> => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

export const login = async (
  data: AuthCredentials
): Promise<User> => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User | null>("/auth/session");
  return response.data;
};

// USER

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

interface UpdateMePayload {
  username: string;
}

export const updateMe = async (
  data: UpdateMePayload
): Promise<User> => {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
};

// NOTES

export const fetchNotes = async (
  page = 1,
  search = "",
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
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
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (
  data: CreateNotePayload
): Promise<Note> => {
  const response = await api.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

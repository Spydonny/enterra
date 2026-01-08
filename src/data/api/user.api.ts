import { api } from "./http";
import type { UserPublic, Message } from "@/types";

const API_BASE = "api/v1";

export async function getUserById(userId: string): Promise<UserPublic> {
  const { data } = await api.get<UserPublic>(`/${API_BASE}/users/${userId}`);
  return data;
}

export async function getUsers(): Promise<UserPublic[]> {
  const { data } = await api.get<UserPublic[]>(`/${API_BASE}/users`);
  return data;
}

export async function createUser(
  email: string,
  password: string,
  fullName?: string
): Promise<UserPublic> {
  const { data } = await api.post<UserPublic>(`/${API_BASE}/users`, {
    email,
    password,
    full_name: fullName,
  });
  return data;
}

export async function getMe(): Promise<UserPublic> {
  const { data } = await api.get<UserPublic>(`/${API_BASE}/users/me`);
  return data;
}

export async function updateMe(payload: Partial<{ email: string }>) {
  const { data } = await api.patch<UserPublic>(`/${API_BASE}/users/me`, payload);
  return data;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<Message> {
  const { data } = await api.patch<Message>(`/${API_BASE}/users/me/password`, {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
}

export async function deleteMe(): Promise<Message> {
  const { data } = await api.delete<Message>(`/${API_BASE}/users/me`);
  return data;
}

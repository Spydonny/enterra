import { api } from "./http";
import type { UserPublic, Message } from "@/types";

export async function getMe(): Promise<UserPublic> {
  const { data } = await api.get<UserPublic>("/users/me");
  return data;
}

export async function updateMe(payload: Partial<{ email: string }>) {
  const { data } = await api.patch<UserPublic>("/users/me", payload);
  return data;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<Message> {
  const { data } = await api.patch<Message>("/users/me/password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
}

export async function deleteMe(): Promise<Message> {
  const { data } = await api.delete<Message>("/users/me");
  return data;
}

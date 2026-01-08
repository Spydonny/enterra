import { api } from "./http";
import type { Token, UserPublic, Message } from "@/types";

/* ================= LOGIN ================= */
export async function loginApi(
  email: string,
  password: string
): Promise<Token> {
  const body = new URLSearchParams({
    username: email,
    password,
  });

  const { data } = await api.post<Token>(
    "/api/v1/login/access-token",
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem("access_token", data.access_token);
  return data;
}

/* ================= SIGNUP ================= */
export type SignupPayload = {
  email: string;
  password: string;
  full_name?: string;
  company_id?: string;
  agreed_to_terms: boolean;
  agreed_to_policy: boolean;
};

export async function signupApi(
  payload: SignupPayload
): Promise<UserPublic> {
  const { data } = await api.post<UserPublic>(
    "/api/v1/users/signup",
    payload
  );
  return data;
}

/* ================= TOKEN ================= */
export async function testToken(): Promise<UserPublic> {
  const { data } = await api.post<UserPublic>("/api/v1/login/test-token");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}

/* ================= PASSWORD ================= */
export async function recoverPassword(
  email: string
): Promise<Message> {
  const { data } = await api.post<Message>(
    `/api/v1/password-recovery/${email}`
  );
  return data;
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<Message> {
  const { data } = await api.post<Message>(
    "/api/v1/reset-password/",
    {
      token,
      new_password: newPassword,
    }
  );
  return data;
}

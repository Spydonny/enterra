// src/data/api/admin.api.ts
import { api } from "./http";

const API_BASE = "/api/v1/admin/stats";

/* ─── Response types ─── */

export interface PlatformOverview {
  total_users: number;
  active_users_today: number;
  new_users_this_month: number;
  total_posts: number;
  total_messages: number;
  total_companies: number;
}

export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  registered_at: string | null;
  monthly_logins: number;
  avg_time_minutes: number;
  likes_count: number;
  messages_count: number;
}

export interface UsersStatsResponse {
  data: UserRow[];
  count: number;
}

export interface SectionClickStats {
  section: string;
  clicks: number;
}

export interface DauPoint {
  date: string;
  count: number;
}

export type Period = "day" | "week" | "month" | "year" | "all";

/* ─── API functions ─── */

export async function getOverview(period: Period = "month"): Promise<PlatformOverview> {
  const { data } = await api.get<PlatformOverview>(`${API_BASE}/overview`, {
    params: { period },
  });
  return data;
}

export async function getUsersStats(period: Period = "month"): Promise<UsersStatsResponse> {
  const { data } = await api.get<UsersStatsResponse>(`${API_BASE}/users`, {
    params: { period },
  });
  return data;
}

export async function getSectionClicks(period: Period = "all"): Promise<SectionClickStats[]> {
  const { data } = await api.get<SectionClickStats[]>(`${API_BASE}/sections`, {
    params: { period },
  });
  return data;
}

export async function getDauHistory(days = 30): Promise<DauPoint[]> {
  const { data } = await api.get<DauPoint[]>(`${API_BASE}/dau`, {
    params: { days },
  });
  return data;
}

export interface TrackEventPayload {
  event_type: "session_start" | "heartbeat" | "section_click";
  section?: string;
  session_id?: string;
  duration_seconds?: number;
}

export async function trackEvent(
  event: TrackEventPayload
): Promise<{ status: string; session_id?: string }> {
  const { data } = await api.post(`${API_BASE}/track`, event);
  return data;
}

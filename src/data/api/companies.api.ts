// src/api/companies.api.ts

import { api } from "./http";

/* =======================
   Shared
======================= */

export type UUID = string;

/* =======================
   Company
======================= */

export interface CompanyBase {
  name: string;
  description?: string | null;
  logo_url?: string | null;
}

export interface CompanyCreate extends CompanyBase {}

export interface CompanyUpdate {
  name?: string | null;
  description?: string | null;
  logo_url?: string | null;
}

export interface CompanyPublic extends CompanyBase {
  id: UUID;
  owner_id: UUID;
  created_at: string;
}

export interface CompaniesPublic {
  data: CompanyPublic[];
  count: number;
}

export interface CompanyProfilePublic extends CompanyBase {
  id: UUID;
  owner_id: UUID;
  created_at: string;
  average_rating?: number | null;
  members: CompanyMemberPublic[];
  ratings: RatingPublic[];
}

/* =======================
   Members
======================= */

export type CompanyRole = "admin" | "member";

export interface CompanyMemberPublic {
  user_id: UUID;
  role: CompanyRole;
  user?: UserPublic | null;
}

export interface CompanyMemberCreate {
  user_id: UUID;
  role?: CompanyRole;
}

export interface CompanyMemberUpdate {
  role: CompanyRole;
}

/* =======================
   Ratings
======================= */

export interface RatingCreate {
  score: number; // 1–5
  comment?: string | null;
}

export interface RatingPublic {
  id: UUID;
  company_id: UUID;
  user_id: UUID;
  score: number;
  comment?: string | null;
  created_at: string;
}

/* =======================
   User
======================= */

export interface UserPublic {
  id: UUID;
  email: string;
  full_name?: string | null;
}

/* =======================
   API – Companies
======================= */

export async function getCompanies(
  skip = 0,
  limit = 100
): Promise<CompaniesPublic> {
  const { data } = await api.get("/api/v1/companies", {
    params: { skip, limit },
  });
  return data;
}

export async function getCompany(
  companyId: UUID
): Promise<CompanyProfilePublic> {
  const { data } = await api.get(`/api/v1/companies/${companyId}`);
  return data;
}

export async function getCompanyByOwnerID(owner_id : UUID): Promise<CompanyProfilePublic> {
  const { data } = await api.get<CompanyProfilePublic>(`/api/v1/companies/owner/${owner_id}`);
  return data;
}

export async function createCompany(
  payload: CompanyCreate
): Promise<CompanyPublic> {
  const { data } = await api.post("/api/v1/companies", payload);
  return data;
}

export async function updateCompany(
  companyId: UUID,
  payload: CompanyUpdate
): Promise<CompanyPublic> {
  const { data } = await api.put(
    `/api/v1/companies/${companyId}`,
    payload
  );
  return data;
}

export async function deleteCompany(
  companyId: UUID
): Promise<{ message: string }> {
  const { data } = await api.delete(
    `/api/v1/companies/${companyId}`
  );
  return data;
}

/* =======================
   API – Members
======================= */

export async function addCompanyMember(
  companyId: UUID,
  payload: CompanyMemberCreate
): Promise<CompanyMemberPublic> {
  const { data } = await api.post(
    `/api/v1/companies/${companyId}/members`,
    payload
  );
  return data;
}

export async function removeCompanyMember(
  companyId: UUID,
  userId: UUID
): Promise<{ message: string }> {
  const { data } = await api.delete(
    `/api/v1/companies/${companyId}/members/${userId}`
  );
  return data;
}

export async function updateCompanyMemberRole(
  companyId: UUID,
  userId: UUID,
  payload: CompanyMemberUpdate
): Promise<CompanyMemberPublic> {
  const { data } = await api.put(
    `/api/v1/companies/${companyId}/members/${userId}`,
    payload
  );
  return data;
}

/* =======================
   API – Ratings
======================= */

export async function createOrUpdateRating(
  companyId: UUID,
  payload: RatingCreate
): Promise<RatingPublic> {
  const { data } = await api.post(
    `/api/v1/companies/${companyId}/ratings`,
    payload
  );
  return data;
}

export async function getCompanyRatings(
  companyId: UUID
): Promise<RatingPublic[]> {
  const { data } = await api.get(
    `/api/v1/companies/${companyId}/ratings`
  );
  return data;
}

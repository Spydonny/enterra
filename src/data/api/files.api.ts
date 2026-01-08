import { api } from "./http"; // твой уже существующий axios instance

/* =======================
   Types
======================= */
export interface FileMeta {
  id: string;
  filename: string;
  content_type: string;
  path: string;
  owner_id: string;
}

/* =======================
   API methods
======================= */

/**
 * Upload file
 */
export async function uploadFile(file: File): Promise<FileMeta> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<FileMeta>("/api/v1/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

/**
 * Download file by id
 * Возвращает Blob, который можно сохранить через a.download
 */
export async function downloadFile(fileId: string): Promise<Blob> {
  const response = await api.get(`/api/v1/files/${fileId}`, {
    responseType: "blob",
  });

  return response.data;
}

export function getFileUrl(fileId: string) {
  return `${import.meta.env.VITE_API_URL}/api/v1/static/uploads/${fileId}`;
}
import { api } from "./http";

/* =======================
   Types
======================= */
export interface FileMeta {
  id: string;
  filename: string;
  content_type: string;
  path: string;        // GCS public URL
  owner_id: string;
  created_at: string;
}

/* =======================
   API methods
======================= */

/**
 * Upload file to GCS
 */
export async function uploadFile(file: File): Promise<FileMeta> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<FileMeta>(
    "/api/v1/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

/**
 * Download file (attachment)
 */
export async function downloadFile(fileId: string): Promise<Blob> {
  const { data } = await api.get(
    `/api/v1/files/download/${fileId}`,
    { responseType: "blob" }
  );

  return data;
}

/**
 * Preview file (inline)
 * Например для <img />, <iframe />, <object />
 */
export function getPreviewUrl(fileId: string): string {
  return `${import.meta.env.VITE_API_URL}/api/v1/files/preview/${fileId}`;
}

/**
 * Direct GCS public URL (если нужен)
 */
export function getPublicFileUrl(meta: FileMeta): string {
  return meta.path;
}

// src/api/feed.api.ts

import { api } from "./http";
import type { UUID } from "@/types.d.ts";

/* =====================================================
   TYPES
===================================================== */

export type Post = {
  id: UUID;
  author_id: UUID;
  company_id?: UUID | null;

  content: string;
  media_urls?: string | null;

  created_at: string;

  comments_count: number;
  reactions_count: number;
  views_count: number; // 🔥 NEW
};

export type PostsResponse = {
  data: Post[];
  count: number;
};

export type CreatePostPayload = {
  content: string;
  media_urls?: string | null;
};

export type Comment = {
  id: UUID;
  post_id: UUID;
  author_id: UUID;
  content: string;
  created_at: string;
};

export type CommentsResponse = {
  data: Comment[];
  count: number;
};

export type CreateCommentPayload = {
  content: string;
};

/* ---------- analytics ---------- */

export type PostAnalytics = {
  views: number;
  likes: number;
  comments: number;
};

export type CompanyAnalytics = {
  posts: number;
  views: number;
  likes: number;
  comments: number;
};

export type PaginationParams = {
  skip?: number;
  limit?: number;
};

/* =====================================================
   API BASE
===================================================== */

const API_BASE = "/api/v1/feed";

/* =====================================================
   API
===================================================== */

export const postsApi = {
  /* =====================================================
     POSTS
  ===================================================== */

  getPosts: async (params?: PaginationParams) => {
    const { data } = await api.get<PostsResponse>(`${API_BASE}/posts`, {
      params,
    });
    return data;
  },

  getPostById: async (postId: UUID) => {
    const { data } = await api.get<Post>(`${API_BASE}/posts/${postId}`);
    return data;
  },

  getCompanyPosts: async (
    companyId: UUID,
    params?: PaginationParams
  ) => {
    const { data } = await api.get<PostsResponse>(
      `${API_BASE}/posts/company/${companyId}`,
      { params }
    );
    return data;
  },

  createPost: async (payload: CreatePostPayload) => {
    const { data } = await api.post<Post>(`${API_BASE}/posts`, payload);
    return data;
  },

  deletePost: async (postId: UUID) => {
    const { data } = await api.delete<{ message: string }>(
      `${API_BASE}/posts/${postId}`
    );
    return data;
  },

  /* =====================================================
     COMMENTS
  ===================================================== */

  getComments: async (postId: UUID, params?: PaginationParams) => {
    const { data } = await api.get<CommentsResponse>(
      `${API_BASE}/posts/${postId}/comments`,
      { params }
    );
    return data;
  },

  createComment: async (
    postId: UUID,
    payload: CreateCommentPayload
  ) => {
    const { data } = await api.post<Comment>(
      `${API_BASE}/posts/${postId}/comments`,
      payload
    );
    return data;
  },

  /* =====================================================
     ❤️ REACTIONS (LIKE TOGGLE)
  ===================================================== */

  /**
   * Toggle like
   * backend сам добавляет/удаляет
   */
  toggleLike: async (postId: UUID) => {
    const { data } = await api.post<{ message: string }>(
      `${API_BASE}/posts/${postId}/reactions`
    );
    return data;
  },

  /* =====================================================
     👁 VIEWS
  ===================================================== */

  /**
   * Вызывать при открытии поста
   */
  registerView: async (postId: UUID) => {
    await api.post(`${API_BASE}/posts/${postId}/view`);
  },

  /* =====================================================
     📊 ANALYTICS
  ===================================================== */

  /**
   * Аналитика поста за период
   */
  getPostAnalytics: async (
    postId: UUID,
    params: {
      date_from: string; // ISO
      date_to: string;
    }
  ) => {
    const { data } = await api.get<PostAnalytics>(
      `${API_BASE}/posts/${postId}/analytics`,
      { params }
    );
    return data;
  },

  /**
   * Аналитика компании
   */
  getCompanyAnalytics: async (
    companyId: UUID,
    params: {
      date_from: string;
      date_to: string;
    }
  ) => {
    const { data } = await api.get<CompanyAnalytics>(
      `${API_BASE}/companies/${companyId}/analytics`,
      { params }
    );
    return data;
  },
};

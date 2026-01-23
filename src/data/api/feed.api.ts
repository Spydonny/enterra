// src/api/feed.api.ts

import { api } from "./http"; // axios instance
import type { UUID } from "@/types.d.ts";

/* ========= TYPES ========= */

export type Post = {
  id: UUID;
  author_id: UUID;
  company_id?: UUID | null;
  content: string;
  media_urls?: string | null;
  created_at: string;
  comments_count: number;
  reactions_count: number;
};

export type PostsResponse = {
  data: Post[];
  count: number;
};

export type CreatePostPayload = {
  content: string;
  media_urls?: string | null;
};

export type CreateCommentPayload = {
  content: string;
};

export type ReactionType = "like" | string;

/* ========= API ========= */

const API_BASE = "api/v1/feed";

export const postsApi = {
  /* ---- POSTS ---- */

  getPosts: async (params?: { skip?: number; limit?: number }) => {
    const { data } = await api.get<PostsResponse>(`/${API_BASE}/posts`, {
      params,
    });
    return data;
  },

  createPost: async (payload: CreatePostPayload) => {
    const { data } = await api.post<Post>(`/${API_BASE}/posts`, payload);
    return data;
  },

  deletePost: async (postId: UUID) => {
    const { data } = await api.delete<{ message: string }>(
      `/${API_BASE}/posts/${postId}`
    );
    return data;
  },

  getPostById: async (postId: UUID) => {
    const { data } = await api.get<Post>(
      `/${API_BASE}/posts/${postId}`
    );
    return data;
  },

  getCompanyPosts: async (
    companyId: UUID,
    params?: { skip?: number; limit?: number }
  ) => {
    const { data } = await api.get<PostsResponse>(
      `/${API_BASE}/posts/company/${companyId}`,
      { params }
    );
    return data;
  },


  /* ---- COMMENTS ---- */

  createComment: async (
    postId: UUID,
    payload: CreateCommentPayload
  ) => {
    const { data } = await api.post(
      `/${API_BASE}/posts/${postId}/comments`,
      payload
    );
    return data;
  },

  /* ---- REACTIONS ---- */

  reactToPost: async (
    postId: UUID,
    type: ReactionType = "like"
  ) => {
    const { data } = await api.post<{ message: string }>(
      `/${API_BASE}/posts/${postId}/reactions`,
      { type }
    );
    return data;
  },
};

export type Company = {
id: string;
name: string;
type: string;
leader: string;
tags: string[];
ratingUsers: number;
ratingEnterra: number;
status: string;
};


// src/types/post.ts
export type Post = {
  id: string;
  author_id: string;
  company_id?: string | null;
  content: string;
  media_urls?: string | null;
  created_at: string;
  comments_count: number;
  reactions_count: number;
};



export type Conversation = {
id: string;
title: string;
subtitle?: string;
unread?: number;
messages: { fromMe: boolean; text: string; time: string }[];
};

export interface Token {
  access_token: string;
  token_type?: string;
}

export interface UserPublic {
  id: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

export interface Message {
  message: string;
}

export type UUID = string;
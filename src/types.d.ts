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


export type Post = {
id: number;
author: string;
role?: string;
time: string;
text: string;
likes: number;
comments: number;
image?: string | null;
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
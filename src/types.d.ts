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
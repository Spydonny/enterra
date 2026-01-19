import { api } from "./http";
import { type UserPublic } from "./companies.api";

const API_BASE = "api/v1/chats";

export interface ChatPublic {
    id: string;
    created_at: string;
    participants: UserPublic[];
}

export interface ChatsPublic {
    data: ChatPublic[];
    count: number;
}

export interface ChatMessageCreate {
    content: string;
}

export interface ChatMessagePublic {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    file_urls?: string | null;
    created_at: string;
}

export interface ChatMessagesPublic {
    data: ChatMessagePublic[];
    count: number;
}

export interface DealCreate {
    status?: string;
    terms?: string | null;
}

export interface DealPublic {
    id: string;
    chat_id: string;
    status: string;
    terms?: string | null;
    approved_by_party1: boolean;
    approved_by_party2: boolean;
    created_at: string;
}

/* =======================
   API
======================= */

export const chatsApi = {
    /* -------- Chats -------- */

    createChat(participantId: string) {
        return api.post<ChatPublic>(API_BASE + "/", null, {
            params: { participant_id: participantId },
        });
    },

    getChats(params?: { skip?: number; limit?: number }) {
        return api.get<ChatsPublic>(API_BASE + "/", { params });
    },

    /* -------- Messages -------- */

    sendMessage(chatId: string, data: ChatMessageCreate) {
        return api.post<ChatMessagePublic>(`${API_BASE}/${chatId}/messages`, data);
    },

    getMessages(
        chatId: string,
        params?: { skip?: number; limit?: number }
    ) {
        return api.get<ChatMessagesPublic>(
            `${API_BASE}/${chatId}/messages`,
            { params }
        );
    },

    /* -------- Deals -------- */

    createDeal(chatId: string, data: DealCreate) {
        return api.post<DealPublic>(`/${API_BASE}/${chatId}/deals`, data);
    },
};

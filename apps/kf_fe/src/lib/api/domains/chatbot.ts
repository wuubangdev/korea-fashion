import { apiFetch, apiGet, type RequestOptions } from "../client";

export type ChatbotProductSuggestion = {
  brand?: string;
  category?: string;
  id: number;
  name: string;
  price?: string;
  url?: string;
};

export type ChatbotSession = {
  createdAt?: string;
  id: number;
  title: string;
  updatedAt?: string;
};

export type ChatbotStoredMessage = {
  content: string;
  createdAt?: string;
  id: number;
  role: "model" | "user";
  suggestions: ChatbotProductSuggestion[];
};

export type ChatbotResponse = {
  answer: string;
  remainingDailyMessages: number;
  sessionId: number;
  suggestions: ChatbotProductSuggestion[];
};

export const chatbotApi = {
  createSession: (clientSessionId: string, options?: RequestOptions) =>
    apiFetch<ChatbotSession>("/api/chatbot/sessions", undefined, {
      ...options,
      body: { clientSessionId },
      method: "POST",
    }),

  deleteSession: (sessionId: number, clientSessionId: string, options?: RequestOptions) =>
    apiFetch<void>("/api/chatbot/sessions/" + sessionId, { clientSessionId }, {
      ...options,
      method: "DELETE",
    }),

  listMessages: (sessionId: number, clientSessionId: string, options?: RequestOptions) =>
    apiGet<ChatbotStoredMessage[]>("/api/chatbot/sessions/" + sessionId + "/messages", { clientSessionId }, options),

  listSessions: (clientSessionId: string, options?: RequestOptions) =>
    apiGet<ChatbotSession[]>("/api/chatbot/sessions", { clientSessionId }, options),

  sendMessage: (message: string, clientSessionId: string, sessionId?: number, options?: RequestOptions) =>
    apiFetch<ChatbotResponse>("/api/chatbot/messages", undefined, {
      ...options,
      body: { clientSessionId, message, sessionId },
      method: "POST",
    }),

  chat: (message: string, history: unknown[] = [], options?: RequestOptions) => {
    void history;
    return apiFetch<ChatbotResponse>("/api/chatbot", undefined, {
      ...options,
      body: { message },
      method: "POST",
    });
  },
};

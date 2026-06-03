"use client";

import Link from "next/link";
import { Bot, MessageCircle, Plus, Send, Sparkles, Trash2, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError, chatbotApi, type ChatbotProductSuggestion, type ChatbotSession, type ChatbotStoredMessage } from "@/lib/api";

type ChatMessage = {
  content: string;
  role: "model" | "user";
  suggestions?: ChatbotProductSuggestion[];
};

const CLIENT_SESSION_KEY = "kf_chat_client_session";

const starterPrompts = [
  "Tư vấn váy đi chơi dưới 500k",
  "Có sản phẩm brand Hàn nào đẹp?",
  "Gợi ý đồ basic dễ phối",
];

const welcomeMessage: ChatMessage = {
  content: "Chào bạn, mình có thể tư vấn sản phẩm, phối đồ, nhãn hiệu, danh mục và giá tại Korea Fashion. Bạn đang tìm item cho dịp nào?",
  role: "model",
};

export function ChatbotWidget() {
  const [activeSessionId, setActiveSessionId] = useState<number>();
  const [clientSessionId, setClientSessionId] = useState("");
  const [input, setInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [remainingDailyMessages, setRemainingDailyMessages] = useState<number>();
  const [sessions, setSessions] = useState<ChatbotSession[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [activeSessionId, sessions],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setClientSessionId(getOrCreateClientSessionId()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextSessions = await chatbotApi.listSessions(clientSessionId);
      setSessions(nextSessions);
      if (!activeSessionId && nextSessions[0]) {
        setActiveSessionId(nextSessions[0].id);
      }
      if (!nextSessions.length) {
        setMessages([welcomeMessage]);
      }
    } catch {
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, clientSessionId]);

  const loadMessages = useCallback(async (sessionId: number) => {
    setIsLoading(true);
    try {
      const storedMessages = await chatbotApi.listMessages(sessionId, clientSessionId);
      setMessages(storedMessages.length ? storedMessages.map(toChatMessage) : [welcomeMessage]);
    } catch {
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [clientSessionId]);

  useEffect(() => {
    if (!isOpen || !clientSessionId) {
      return;
    }
    const timer = window.setTimeout(() => void loadSessions(), 0);
    return () => window.clearTimeout(timer);
  }, [clientSessionId, isOpen, loadSessions]);

  useEffect(() => {
    if (!activeSessionId || !clientSessionId) {
      return;
    }
    const timer = window.setTimeout(() => void loadMessages(activeSessionId), 0);
    return () => window.clearTimeout(timer);
  }, [activeSessionId, clientSessionId, loadMessages]);

  useEffect(() => {
    queueMicrotask(() => scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
  }, [messages, isSending]);

  async function createNewChat() {
    if (!clientSessionId || isSending) {
      return;
    }
    setIsLoading(true);
    try {
      const session = await chatbotApi.createSession(clientSessionId);
      setSessions((current) => [session, ...current]);
      setActiveSessionId(session.id);
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCurrentChat() {
    if (!activeSessionId || isDeleting) {
      return;
    }
    setIsDeleting(true);
    try {
      await chatbotApi.deleteSession(activeSessionId, clientSessionId);
      const nextSessions = sessions.filter((session) => session.id !== activeSessionId);
      setSessions(nextSessions);
      setActiveSessionId(nextSessions[0]?.id);
      setMessages([welcomeMessage]);
    } finally {
      setIsDeleting(false);
    }
  }

  async function sendMessage(messageText?: string) {
    const content = (messageText ?? input).trim();
    if (!content || isSending || !clientSessionId) {
      return;
    }

    setMessages((current) => [...current, { content, role: "user" }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await chatbotApi.sendMessage(content, clientSessionId, activeSessionId);
      setActiveSessionId(response.sessionId);
      setRemainingDailyMessages(response.remainingDailyMessages);
      setMessages((current) => [
        ...current,
        {
          content: response.answer,
          role: "model",
          suggestions: response.suggestions ?? [],
        },
      ]);
      void loadSessions();
    } catch (error) {
      const message = error instanceof ApiError && error.status === 429
        ? error.message
        : "Mình chưa kết nối được trợ lý lúc này. Bạn thử hỏi lại sau ít phút hoặc dùng ô tìm kiếm sản phẩm nhé.";
      setMessages((current) => [...current, { content: message, role: "model" }]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <>
      {isOpen ? (
        <section className="fixed bottom-20 right-4 z-50 flex h-[min(660px,calc(100vh-7rem))] w-[min(410px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl shadow-stone-950/20">
          <header className="flex items-center justify-between gap-3 border-b border-stone-200 bg-stone-950 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/10">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">Tư vấn Korea Fashion</h2>
                <p className="truncate text-xs text-white/65">Chỉ tư vấn sản phẩm, danh mục, nhãn hiệu và giá</p>
              </div>
            </div>
            <Button aria-label="Đóng chatbot" className="shrink-0 text-white hover:bg-white/10" size="icon" type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="flex items-center gap-2 border-b border-stone-200 bg-white p-2">
            <select
              aria-label="Chọn cuộc chat"
              className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-2.5 py-2 text-xs font-medium text-stone-700 outline-none focus:border-emerald-700"
              value={activeSessionId ?? ""}
              onChange={(event) => setActiveSessionId(event.target.value ? Number(event.target.value) : undefined)}
            >
              <option value="">Chat mới</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title || "Chat tư vấn sản phẩm"}
                </option>
              ))}
            </select>
            <Button aria-label="Tạo chat mới" disabled={isLoading || isSending} size="icon" type="button" variant="outline" onClick={() => void createNewChat()}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button aria-label="Xóa chat hiện tại" disabled={!activeSessionId || isDeleting} size="icon" type="button" variant="outline" onClick={() => void deleteCurrentChat()}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-3">
            {isLoading && !messages.length ? (
              <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-500 shadow-sm">Đang tải lịch sử chat...</div>
            ) : null}
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}-${message.content.slice(0, 16)}`} className={message.role === "user" ? "ml-auto max-w-[82%]" : "mr-auto max-w-[88%]"}>
                <div
                  className={`whitespace-pre-line rounded-lg px-3 py-2 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-stone-950 text-white"
                      : "border border-stone-200 bg-white text-stone-800"
                  }`}
                >
                  {message.content}
                </div>
                {message.suggestions?.length ? <ProductSuggestions suggestions={message.suggestions} onNavigate={() => setIsOpen(false)} /> : null}
              </article>
            ))}
            {isSending ? (
              <div className="mr-auto max-w-[88%] rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-500 shadow-sm">
                Bạn đợi chút nhé, bot đang suy nghĩ và soạn câu trả lời...
              </div>
            ) : null}
            <div ref={scrollRef} />
          </div>

          <div className="border-t border-stone-200 bg-white p-3">
            {activeSession?.title ? <p className="mb-2 line-clamp-1 text-xs text-stone-500">{activeSession.title}</p> : null}
            {remainingDailyMessages !== undefined && remainingDailyMessages <= 10 ? (
              <p className="mb-2 text-xs font-medium text-amber-700">Còn {remainingDailyMessages} lượt chat hôm nay.</p>
            ) : null}
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="shrink-0 rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                maxLength={1000}
                placeholder="Bạn muốn tìm sản phẩm gì?"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <Button aria-label="Gửi tin nhắn" disabled={isSending || !input.trim()} size="icon" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        aria-label="Mở tư vấn sản phẩm"
        className="group flex items-center gap-2"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <span className="pointer-events-none translate-x-2 rounded-md bg-stone-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          Tư vấn AI
        </span>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg ring-1 ring-white/20 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800">
          <MessageCircle className="h-5 w-5" />
          <Sparkles className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-white p-0.5 text-emerald-700" />
        </span>
      </button>
    </>
  );
}

function ProductSuggestions({ suggestions, onNavigate }: { onNavigate: () => void; suggestions: ChatbotProductSuggestion[] }) {
  return (
    <div className="mt-2 grid gap-2">
      {suggestions.map((product) => (
        <Link
          key={product.id}
          className="rounded-md border border-stone-200 bg-white p-2 text-xs shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
          href={product.url || `/products/${product.id}`}
          onClick={onNavigate}
        >
          <span className="line-clamp-1 font-semibold text-stone-950">{product.name}</span>
          <span className="mt-1 block text-stone-500">
            {[product.brand, product.category].filter(Boolean).join(" / ") || "Sản phẩm"}
          </span>
          {product.price ? <span className="mt-1 block font-semibold text-emerald-700">{product.price}</span> : null}
        </Link>
      ))}
    </div>
  );
}

function toChatMessage(message: ChatbotStoredMessage): ChatMessage {
  return {
    content: message.content,
    role: message.role,
    suggestions: message.suggestions ?? [],
  };
}

function getOrCreateClientSessionId() {
  const existing = localStorage.getItem(CLIENT_SESSION_KEY);
  if (existing) {
    return existing;
  }
  const next = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(CLIENT_SESSION_KEY, next);
  return next;
}

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ContractModal } from "../components/ContractModel";
import { chatsApi, type ChatPublic, type ChatMessagePublic } from "@/data/api/chats.api";
import { getMe } from "@/data/api/user.api";
import { getCompanyByOwnerID } from "@/data/api/companies.api";
import { ChatListSkeleton, MessagesSkeleton } from "@/components/Skeleton";
import { Check, CheckCheck, Trash2 } from "lucide-react";

export const Messages: React.FC = () => {
  const [chats, setChats] = useState<ChatPublic[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessagePublic[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Chat metadata (user/company names)
  const [chatMetadata, setChatMetadata] = useState<Map<string, { title: string; subtitle?: string }>>(new Map());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // For re-rendering remaining time on delete buttons
  const [, setTick] = useState(0);

  // Contract modal state
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(
    `# Договор\n\nУсловия сотрудничества:\n- Срок: 3 месяца\n- Оплата: по этапам\n`
  );
  const [escrow, setEscrow] = useState(false);
  const [myAgreement, setMyAgreement] = useState(false);
  const [otherAgreement, setOtherAgreement] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tick every 30s so remaining-time labels update
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Load current user
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const me = await getMe();
        setCurrentUserId(me.id);
      } catch (err) {
        console.error("Failed to load current user:", err);
      }
    }
    loadCurrentUser();
  }, []);

  // Load chats
  useEffect(() => {
    async function loadChats() {
      try {
        setIsLoadingChats(true);
        const response = await chatsApi.getChats({ skip: 0, limit: 50 });
        setChats(response.data.data);

        if (response.data.data.length > 0 && !activeId) {
          setActiveId(response.data.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setIsLoadingChats(false);
      }
    }

    loadChats();
  }, []);

  // Load chat metadata (participant names from companies)
  useEffect(() => {
    async function loadChatMetadata() {
      const metadata = new Map<string, { title: string; subtitle?: string }>();

      for (const chat of chats) {
        // Find the other participant (not current user)
        const otherParticipant = chat.participants.find(p => p.id !== currentUserId);

        if (otherParticipant) {
          try {
            // Try to get company info for this user
            const company = await getCompanyByOwnerID(otherParticipant.id);
            metadata.set(chat.id, {
              title: company.name || otherParticipant.full_name || otherParticipant.email,
              subtitle: company.company_type || undefined
            });
          } catch {
            // If no company, just use user info
            metadata.set(chat.id, {
              title: otherParticipant.full_name || otherParticipant.email,
              subtitle: undefined
            });
          }
        }
      }

      setChatMetadata(metadata);
    }

    if (chats.length > 0 && currentUserId) {
      loadChatMetadata();
    }
  }, [chats, currentUserId]);

  // Load messages for active chat + mark as read
  useEffect(() => {
    async function loadMessages() {
      if (!activeId) return;

      try {
        setIsLoadingMessages(true);
        const response = await chatsApi.getMessages(activeId, { skip: 0, limit: 100 });
        setMessages(response.data.data);

        // Mark messages from the other user as read
        await chatsApi.markAsRead(activeId).catch(() => { });
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadMessages();
  }, [activeId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = messageInput.trim();
    if (!text || !activeId || isSending) return;

    try {
      setIsSending(true);
      const newMessage = await chatsApi.sendMessage(activeId, { content: text });
      setMessages(prev => [...prev, newMessage.data]);
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  }

  // Helper: minutes remaining for deletion
  const getMinutesRemaining = useCallback((createdAt: string): number => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const elapsed = (now - created) / (1000 * 60);
    return Math.max(0, Math.ceil(30 - elapsed));
  }, []);

  const canDelete = useCallback(
    (msg: ChatMessagePublic) => {
      return msg.sender_id === currentUserId && getMinutesRemaining(msg.created_at) > 0;
    },
    [currentUserId, getMinutesRemaining]
  );

  async function confirmDelete() {
    if (!deleteId) return;

    const id = deleteId;
    setDeleteId(null);

    try {
      setMessages(prev => prev.filter(m => m.id !== id));
      await chatsApi.deleteMessage(id);
    } catch (err) {
      console.error("Failed to delete message:", err);

      const response = await chatsApi.getMessages(activeId, { skip: 0, limit: 100 });
      setMessages(response.data.data);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  // Status indicator for sent messages
  function MessageStatus({ msg }: { msg: ChatMessagePublic }) {
    if (msg.sender_id !== currentUserId) return null;

    if (msg.is_read) {
      return (
        <span className="inline-flex items-center ml-1.5" title="Прочитано">
          <CheckCheck size={14} className="text-blue-400" />
        </span>
      );
    }
    if (msg.is_delivered) {
      return (
        <span className="inline-flex items-center ml-1.5" title="Доставлено">
          <CheckCheck size={14} className="text-gray-300" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center ml-1.5" title="Отправлено">
        <Check size={14} className="text-gray-300" />
      </span>
    );
  }

  const activeMeta = chatMetadata.get(activeId) || { title: "Чат", subtitle: undefined };

  // Find the message being deleted (for the modal)
  const deletingMessage = deleteId ? messages.find(m => m.id === deleteId) : null;
  const deleteMinutesLeft = deletingMessage ? getMinutesRemaining(deletingMessage.created_at) : 0;

  return (
    <div className="flex h-screen bg-[#f7f7f5]">
      {/* LEFT LIST */}
      <div
        className="
          w-96 border-r bg-white/80 backdrop-blur-xl
          shadow-xl border-gray-200/70
          flex flex-col
        "
      >
        <div className="p-4 border-b border-gray-200/70 bg-white/70 backdrop-blur-sm">
          <input
            placeholder="Поиск сообщений..."
            className="
              w-full border border-gray-300/70 rounded-xl
              px-4 py-2 bg-white/50 shadow-sm
              focus:ring-2 focus:ring-blue-500/30 transition
            "
          />
        </div>

        <div className="flex-1 overflow-auto divide-y divide-gray-100">
          {isLoadingChats ? (
            <ChatListSkeleton />
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Нет активных чатов
            </div>
          ) : (
            chats.map((chat) => {
              const active = chat.id === activeId;
              const meta = chatMetadata.get(chat.id) || { title: "Чат" };

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveId(chat.id)}
                  className={`
                    p-4 cursor-pointer transition
                    ${active
                      ? "bg-gradient-to-r from-blue-50 to-blue-100/60 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex justify-between">
                    <div>
                      <div
                        className={`
                    font-semibold text-[15px]
                    ${active ? "text-blue-700" : "text-gray-800"}
                  `}
                      >
                        {meta.title}
                      </div>
                      {meta.subtitle && (
                        <div className="text-xs text-gray-500 capitalize">
                          {meta.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div className="flex-1 p-6 flex flex-col">
        {!activeId ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите чат для начала общения
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {activeMeta.title}
                </div>
                {activeMeta.subtitle && (
                  <div className="text-sm text-gray-500 capitalize">
                    {activeMeta.subtitle}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  className="
                    px-4 py-2 bg-gray-100 hover:bg-gray-200
                    rounded-xl text-gray-700 shadow-sm transition
                  "
                  onClick={() => setOpen(true)}
                >
                  Договор
                </button>

                <button
                  className="
                    px-4 py-2 rounded-xl
                    bg-gradient-to-r from-blue-600 to-blue-700
                    text-white shadow-md hover:shadow-lg transition
                  "
                >
                  Сделка
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-auto pr-2 space-y-5">
              {isLoadingMessages ? (
                <MessagesSkeleton />
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Нет сообщений. Начните переписку!
                </div>
              ) : (
                messages.map((msg) => {
                  const fromMe = msg.sender_id === currentUserId;
                  const deletable = canDelete(msg);
                  const minutesLeft = getMinutesRemaining(msg.created_at);

                  const time = new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`group relative max-w-[65%]
                        ${fromMe ? "ml-auto" : ""}
                      `}
                    >
                      {/* Delete button — only for sender, within 30 min */}
                      {fromMe && deletable && (
                        <button
                          onClick={() => setDeleteId(msg.id)}
                          title={`Удалить (осталось ${minutesLeft} мин)`}
                          className="
                            absolute -top-2 -right-2 opacity-0 group-hover:opacity-100
                            bg-white border border-gray-200 shadow-md rounded-full w-8 h-8
                            flex items-center justify-center
                            hover:bg-red-50 hover:border-red-200 transition-all duration-200
                          "
                        >
                          <Trash2 size={13} className="text-gray-500 hover:text-red-500" />
                        </button>
                      )}

                      <div
                        className={`
                          p-4 rounded-2xl shadow-sm
                          ${fromMe
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                            : "bg-white border border-gray-200/70 text-gray-800"
                          }
                        `}
                      >
                        <div className="text-[15px] whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>

                        <div className={`flex items-center gap-0.5 text-xs mt-2 ${fromMe ? "text-blue-100 justify-end" : "text-gray-400"}`}>
                          <span>{time}</span>
                          <MessageStatus msg={msg} />
                        </div>
                      </div>
                    </div>
                  );
                })

              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div
              className="
                mt-4 p-3 bg-white/80 backdrop-blur-xl
                border border-gray-200/70 rounded-2xl
                shadow-sm flex items-center gap-3
              "
            >
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите сообщение..."
                className="
                  flex-1 border border-gray-300/70 rounded-xl
                  px-4 py-3 bg-white/50 shadow-sm
                  focus:ring-2 focus:ring-blue-500/30 transition
                "
              />

              <button
                onClick={sendMessage}
                disabled={!messageInput.trim() || isSending}
                className="
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-blue-600 to-blue-700
                  text-white shadow-md hover:shadow-lg transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isSending ? "Отправка..." : "Отправить"}
              </button>
            </div>
          </>
        )}
      </div>

      <ContractModal
        open={open}
        onClose={() => setOpen(false)}
        content={content}
        setContent={setContent}
        escrow={escrow}
        setEscrow={setEscrow}
        myAgreement={myAgreement}
        setMyAgreement={setMyAgreement}
        otherAgreement={otherAgreement}
        setOtherAgreement={setOtherAgreement}
        smsVerified={smsVerified}
        setSmsVerified={setSmsVerified}
      />

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="
              bg-white rounded-2xl shadow-2xl
              w-[380px] p-6 space-y-5
              animate-in fade-in zoom-in
            "
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Удалить сообщение?
                </div>
                <div className="text-sm text-gray-500">
                  Это действие нельзя отменить.
                </div>
              </div>
            </div>

            {deleteMinutesLeft > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-amber-700">
                  Осталось {deleteMinutesLeft} мин для удаления
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="
                  px-4 py-2 rounded-xl
                  bg-gray-100 hover:bg-gray-200
                  text-gray-700 transition
                "
              >
                Отмена
              </button>

              <button
                onClick={confirmDelete}
                className="
                  px-4 py-2 rounded-xl
                  bg-red-600 hover:bg-red-700
                  text-white shadow-md transition
                "
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

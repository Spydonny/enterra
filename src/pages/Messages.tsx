import React, { useEffect, useState, useRef } from "react";
import { ContractModal } from "../components/ContractModel";
import { chatsApi, type ChatPublic, type ChatMessagePublic } from "@/data/api/chats.api";
import { getMe } from "@/data/api/user.api";
import { getCompanyByOwnerID } from "@/data/api/companies.api";

export const Messages: React.FC = () => {
  const [chats, setChats] = useState<ChatPublic[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessagePublic[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");

  // Chat metadata (user/company names)
  const [chatMetadata, setChatMetadata] = useState<Map<string, { title: string; subtitle?: string }>>(new Map());

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

  // Load messages for active chat
  useEffect(() => {
    async function loadMessages() {
      if (!activeId) return;

      try {
        setIsLoadingMessages(true);
        const response = await chatsApi.getMessages(activeId, { skip: 0, limit: 100 });
        setMessages(response.data.data);
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
    if (!text || !activeId) return;

    try {
      const newMessage = await chatsApi.sendMessage(activeId, { content: text });
      setMessages(prev => [...prev, newMessage.data]);
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  const activeMeta = chatMetadata.get(activeId) || { title: "Чат", subtitle: undefined };

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
            <div className="p-4 text-center text-gray-500">
              Загрузка чатов...
            </div>
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
                <div className="flex items-center justify-center h-full text-gray-500">
                  Загрузка сообщений...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Нет сообщений. Начните переписку!
                </div>
              ) : (
                messages.map((msg) => {
                  const fromMe = msg.sender_id === currentUserId;
                  const time = new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`
                        max-w-[65%] p-4 rounded-2xl shadow-sm
                        ${fromMe
                          ? "ml-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                          : "bg-white border border-gray-200/70 text-gray-800"
                        }
                      `}
                    >
                      <div className="text-[15px] whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                      <div
                        className={`text-xs mt-2 ${fromMe ? "text-blue-100" : "text-gray-400"
                          }`}
                      >
                        {time}
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
                disabled={!messageInput.trim()}
                className="
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-blue-600 to-blue-700
                  text-white shadow-md hover:shadow-lg transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Отправить
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
    </div>
  );
};

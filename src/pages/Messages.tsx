import React, { useEffect, useState } from "react";
import type { Conversation } from "../types";
import { ContractModal } from "../components/ContractModel";

type Props = {
  conversations: Conversation[];
  activeId: string;
  setActiveId: (id: string) => void;
};

export const Messages: React.FC<Props> = ({
  conversations,
  activeId,
  setActiveId,
}) => {
  const [localConversations, setLocalConversations] = useState<
    Conversation[]
  >(conversations);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  const conv =
    localConversations.find((c) => c.id === activeId) ??
    localConversations[0];

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(
    `# Договор\n\nУсловия сотрудничества:\n- Срок: 3 месяца\n- Оплата: по этапам\n`
  );
  const [escrow, setEscrow] = useState(false);
  const [myAgreement, setMyAgreement] = useState(false);
  const [otherAgreement, setOtherAgreement] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);

  function sendMessage(text: string) {
    const val = text.trim();
    if (!val || !conv) return;

    setLocalConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  fromMe: true,
                  text: val,
                  time: new Date().toLocaleTimeString().slice(0, 5),
                },
              ],
            }
          : c
      )
    );
  }

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
          {localConversations.map((c) => {
            const active = c.id === activeId;

            return (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`
                  p-4 cursor-pointer transition
                  ${
                    active
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
                      {c.title}
                    </div>
                    <div className="text-xs text-gray-500">{c.subtitle}</div>
                  </div>

                  {c.unread ? (
                    <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md shadow-sm">
                      {c.unread}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div className="flex-1 p-6 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="text-xl font-bold text-gray-900">{conv?.title}</div>
            <div className="text-sm text-gray-500">{conv?.subtitle}</div>
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
          {conv?.messages.map((m, i) => (
            <div
              key={i}
              className={`
                max-w-[65%] p-4 rounded-2xl shadow-sm
                ${
                  m.fromMe
                    ? "ml-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-white border border-gray-200/70 text-gray-800"
                }
              `}
            >
              <div className="text-[15px] whitespace-pre-wrap leading-relaxed">
                {m.text}
              </div>
              <div
                className={`text-xs mt-2 ${
                  m.fromMe ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {m.time}
              </div>
            </div>
          ))}
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
            id="msg_input"
            placeholder="Введите сообщение..."
            className="
              flex-1 border border-gray-300/70 rounded-xl
              px-4 py-3 bg-white/50 shadow-sm
              focus:ring-2 focus:ring-blue-500/30 transition
            "
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const el = e.target as HTMLInputElement;
                sendMessage(el.value);
                el.value = "";
              }
            }}
          />

          <button
            className="
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-blue-600 to-blue-700
              text-white shadow-md hover:shadow-lg transition
            "
            onClick={() => {
              const el = document.getElementById("msg_input") as HTMLInputElement;
              if (el) {
                sendMessage(el.value);
                el.value = "";
              }
            }}
          >
            Отправить
          </button>
        </div>
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

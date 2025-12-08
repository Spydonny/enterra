import React, { useEffect } from "react";

type ContractModalProps = {
  open: boolean;
  onClose: () => void;
  content: string;
  setContent: (v: string) => void;
  escrow: boolean;
  setEscrow: (v: boolean) => void;
  myAgreement: boolean;
  setMyAgreement: (v: boolean) => void;
  otherAgreement: boolean;
  setOtherAgreement: (v: boolean) => void;
  smsVerified: boolean;
  setSmsVerified: (v: boolean) => void;
};

export const ContractModal: React.FC<ContractModalProps> = ({
  open,
  onClose,
  content,
  setContent,
  escrow,
  setEscrow,
  myAgreement,
  setMyAgreement,
  otherAgreement,
  setOtherAgreement,
  smsVerified,
  setSmsVerified,
}) => {
  const [smsCode, setSmsCode] = React.useState("");

  useEffect(() => {
    if (!open) setSmsCode("");
  }, [open]);

  function sendSms() {
    alert("Симуляция: код отправлен — 1234");
  }

  function verifySms() {
    if (smsCode.trim() === "1234") {
      setSmsVerified(true);
      alert("Документ подписан (симуляция)");
    } else {
      alert("Неверный код");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Затемнение */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Модалка */}
      <div
        className="
          z-10 w-[900px] max-h-[90vh] overflow-auto
          bg-white/85 backdrop-blur-xl 
          border border-gray-200 
          shadow-2xl shadow-gray-300/40 
          rounded-2xl p-8
          animate-fadeIn
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Договор — обсуждение
          </h2>

          <div className="flex gap-2">
            <button
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  myAgreement
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
              onClick={() => setMyAgreement(!myAgreement)}
            >
              Я согласен
            </button>

            <button
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  otherAgreement
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
              onClick={() => setOtherAgreement(!otherAgreement)}
            >
              Партнёр согласен
            </button>

            <button
              className="
                px-4 py-2 rounded-xl text-sm font-medium 
                bg-red-50 text-red-600 hover:bg-red-100
              "
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <div className="text-sm text-gray-500 mb-2">
              Редактор договора (оба участника видят изменения в реальном времени)
            </div>

            <textarea
              className="
                w-full h-64 border border-gray-300 rounded-xl
                p-4 text-sm leading-relaxed
                focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                transition-all bg-white
              "
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-3 flex gap-3 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={escrow}
                  onChange={(e) => setEscrow(e.target.checked)}
                  className="w-4 h-4"
                />
                Использовать ESCROW
              </label>

              <button
                className="
                  px-4 py-2 rounded-xl text-sm
                  bg-blue-600 hover:bg-blue-700 
                  text-white shadow-sm transition-all
                "
                onClick={() => {
                  navigator.clipboard?.writeText(content);
                  alert("Содержимое скопировано");
                }}
              >
                Скопировать
              </button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="text-sm text-gray-500">Превью документа</div>

            <div
              className="
                mt-2 bg-gray-50 p-4 rounded-xl h-64 
                overflow-auto border border-gray-200
              "
            >
              <div className="text-xs text-gray-600">
                Статус:{" "}
                <b>
                  {myAgreement && otherAgreement
                    ? "agreed"
                    : myAgreement || otherAgreement
                    ? "partial"
                    : "draft"}
                </b>
              </div>

              <div
                className="
                  mt-3 whitespace-pre-wrap 
                  bg-white/90 border border-gray-200
                  p-4 rounded-lg text-sm shadow-inner
                "
              >
                {content}
              </div>
            </div>

            {/* SMS Sign */}
            <div className="mt-4">
              {myAgreement && otherAgreement && !smsVerified ? (
                <>
                  <div className="text-sm text-gray-600 mb-2">
                    Обе стороны согласовали условия. Отправьте SMS-подпись:
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="
                        px-4 py-2 bg-blue-600 text-white rounded-xl 
                        text-sm font-medium hover:bg-blue-700
                      "
                      onClick={sendSms}
                    >
                      Отправить код
                    </button>

                    <input
                      className="
                        border border-gray-300 rounded-xl px-3 py-2 text-sm
                        focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                        transition-all
                      "
                      placeholder="Код"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                    />

                    <button
                      className="
                        px-4 py-2 bg-green-600 text-white rounded-xl 
                        text-sm font-medium hover:bg-green-700
                      "
                      onClick={verifySms}
                    >
                      Подписать
                    </button>
                  </div>
                </>
              ) : null}

              {smsVerified ? (
                <div className="mt-3 text-green-700 text-sm font-medium">
                  Документ подписан ✔  
                  <span className="text-gray-600 ml-1">
                    (ESCROW: {escrow ? "включён" : "не используется"})
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

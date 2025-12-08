import { useState } from "react";
import { Search, Eye, Trash2, Download, Share2, Filter } from "lucide-react";

export default function Documents() {
  const [activeTab, setActiveTab] = useState("my");

  return (
    <div className="p-10 bg-[#f7f7f5] min-h-screen text-gray-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide">Документы</h1>

        <button className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:shadow-lg transition">
          Загрузить документ
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 border-b border-gray-300/70 pb-2 mb-8">
        {[
          { id: "my", label: "Мои документы" },
          { id: "templates", label: "Шаблоны" },
          { id: "shared", label: "Общие документы" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "shared" && (
        <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-600">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold mb-2">Общие документы</h2>
          <p className="max-w-md text-sm mb-6">
            Здесь будут отображаться документы, которыми с вами поделились другие пользователи
          </p>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:shadow-lg transition">
            Запросить доступ к документу
          </button>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-3 gap-6">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow transition"
            >
              <div className="text-4xl mb-4">📄</div>

              <h3 className="font-semibold text-lg mb-1">{t.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{t.desc}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className="px-2 py-0.5 bg-gray-200 rounded-md">{t.tag}</span>
                <span>{t.downloads} скачиваний</span>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:shadow-lg transition">
                Скачать
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "my" && (
        <div>
          {/* SEARCH & FILTERS */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              <input
                placeholder="Поиск документов..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300/70 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white shadow hover:bg-gray-100 transition">
              <Filter size={18} /> Фильтры
            </button>
          </div>

          {/* DOCUMENT LIST */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      {doc.icon} {doc.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2">{doc.desc}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{doc.date}</span>
                      <span>{doc.company}</span>
                      <span>{doc.size}</span>
                      <span>{doc.format}</span>
                    </div>

                    <div className="mt-2 flex gap-2">
                      {doc.labels.map((l) => (
                        <span
                          key={l}
                          className="px-2 py-0.5 text-xs rounded-md bg-blue-600 text-white"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <Eye className="cursor-pointer hover:text-blue-600" />
                    <Download className="cursor-pointer hover:text-blue-600" />
                    <Share2 className="cursor-pointer hover:text-blue-600" />
                    <Trash2 className="cursor-pointer hover:text-red-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// MOCK DATA
const templates = [
  {
    id: 1,
    title: "Договор подряда 3000",
    desc: "Космически улучшенный шаблон договора для галактических IT-подрядчиков",
    tag: "Документы будущего",
    downloads: 999,
  },
  {
    id: 2,
    title: "NDA — Никому Не Дам АЙТИ",
    desc: "Сверхсекретное соглашение, после подписания которого можно только молчать",
    tag: "Тайны и Заговоры",
    downloads: 404,
  },
  {
    id: 3,
    title: "Техническое задание Deluxe",
    desc: "ТЗ уровня «я сам еще не знаю, но вот вам документ»",
    tag: "Проектная магия",
    downloads: 256,
  },
  {
    id: 4,
    title: "Инвестдоговор 'Дайте Денег'",
    desc: "Шаблон для привлечения инвестиций любой ценой (желательно законно)",
    tag: "Инвестиции и надежды",
    downloads: 73,
  },
  {
    id: 5,
    title: "Партнёрское соглашение 2.0",
    desc: "Официальный документ о дружбе между компаниями (и общих страданиях)",
    tag: "Партнёрка",
    downloads: 1337,
  },
];

const documents = [
  {
    id: 1,
    title: "Договор на разработку ПО (эпичный)",
    desc: "Договор на создание приложения, которое все хотели, но никто не заказал вовремя",
    date: "15.01.2024",
    company: "ТОО MegaTechnoCorp",
    size: "2.4 MB",
    format: "PDF",
    labels: ["Договор", "подписан", "не отменить"],
    icon: "📕",
  },
  {
    id: 2,
    title: "Техническое задание — версия 'мы допишем потом'",
    desc: "ТЗ, в котором уже есть 3 правки, 2 конфликта и ни одного финального технического решения",
    date: "10.01.2024",
    company: "Внутренний хаос отдел разработки",
    size: "1.8 MB",
    format: "DOCX",
    labels: ["Проектная документация", "черновик", "осторожно"],
    icon: "📘",
  },
  {
    id: 3,
    title: "Справка о налоговых обязательствах (она существует!)",
    desc: "Official paper, доказывающий, что налоги — не миф",
    date: "08.01.2024",
    company: "Налоговая империя",
    size: "856 KB",
    format: "PDF",
    labels: ["Справки", "действующий", "страшно"],
    icon: "📙",
  },
];

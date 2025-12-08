import { useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  ChevronRight,
} from "lucide-react";

export default function Profile() {
  const [tab, setTab] = useState<"pub" | "cases" | "reviews">("pub");

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 pb-20">
      {/* Cover */}
      <div className="w-full bg-gray-200 h-56 rounded-b-xl" />

      <div className="max-w-6xl w-full px-4 mt-[-48px]">
        {/* Header Block */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md" />
          <div className="flex-1">
            <div className="text-xl font-semibold">ТОО “Техно Плюс”</div>
            <div className="text-sm text-gray-500">IT компания</div>
          </div>

          {/* Buttons */}
          {tab === "pub" ? (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
              Редактировать
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                Сообщение
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
                Подписаться
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-6 border-b border-gray-200 pb-2">
          <button
            className={`px-3 py-2 ${
              tab === "pub"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setTab("pub")}
          >
            Публикации
          </button>

          <button
            className={`px-3 py-2 ${
              tab === "cases"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setTab("cases")}
          >
            Кейсы
          </button>

          <button
            className={`px-3 py-2 ${
              tab === "reviews"
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setTab("reviews")}
          >
            Отзывы
          </button>
        </div>

        <div className="flex mt-6 gap-6">
          {/* Left column */}
          <div className="flex-1 space-y-6">
            {/* -------------------- ПУБЛИКАЦИИ -------------------- */}
            {tab === "pub" && (
              <>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow p-4 space-y-3"
                  >
                    {/* User info */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          Jane Labadin
                        </div>
                        <div className="text-xs text-gray-500">
                          2 дня назад
                        </div>
                      </div>
                    </div>

                    <div className="text-gray-900 text-[15px] leading-relaxed">
                      <span className="text-xl">🎉</span> Важные новости! Мы
                      запускаем новую программу поддержки стартапов...
                    </div>

                    <div className="w-full h-60 bg-gray-200 rounded-xl" />

                    {/* Buttons */}
                    <div className="flex gap-6 text-gray-500 text-sm pt-2">
                      <button>👍 24</button>
                      <button>💬 6</button>
                      <button>↗️ Поделиться</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* -------------------- КЕЙСЫ -------------------- */}
            {tab === "cases" && (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((c) => (
                  <div
                    key={c}
                    className="bg-white shadow rounded-xl p-4 flex flex-col"
                  >
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3" />

                    <div className="font-semibold">
                      Мобильное приложение для банка
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      Разработка мобильного приложения под ключ...
                    </div>

                    <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      Подробнее
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* -------------------- ОТЗЫВЫ -------------------- */}
            {tab === "reviews" && (
              <div className="text-gray-600">Раздел отзывов пока пуст</div>
            )}
          </div>

          {/* Right column */}
          <div className="w-80 space-y-6">
            {/* Rating */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <div className="text-lg font-semibold">4.9</div>
                <div className="text-sm text-gray-500">(28 отзывов)</div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold text-lg mb-2">О нас</div>

              <p className="text-sm text-gray-600 leading-relaxed">
                Мы ведущая IT-компания в Казахстане, специализирующаяся на
                разработке мобильных приложений и веб-сервисов.
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex gap-2 items-center">
                  <Mail size={16} /> info@technoplus.kz
                </div>
                <div className="flex gap-2 items-center">
                  <Phone size={16} /> +7 (777) 123-45-67
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} /> г. Алматы, ул. Абая, 150
                </div>
                <div className="flex gap-2 items-center">
                  <Globe size={16} /> Основана в 2015 году
                </div>
              </div>

              <button className="mt-3 text-blue-600 text-sm flex items-center gap-1">
                Показать больше <ChevronRight size={16} />
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold text-lg mb-3">Достижения</div>

              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Лучшая IT-компания 2022",
                  "Тop-10 разработчиков по версии Digital Kazakhstan",
                  "Победитель Product Awards 2021",
                  "Партнёр Microsoft c 2018 года",
                ].map((t, idx) => (
                  <li key={idx} className="flex gap-2 items-center">
                    <Award className="text-yellow-500" size={18} /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold mb-3">Услуги</div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Разработка ПО",
                  "Мобильные приложения",
                  "Веб-разработка",
                  "UI/UX дизайн",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

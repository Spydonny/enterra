import { useState, useEffect } from "react";
import { Star, MapPin, Phone, Mail, Globe, Award, ChevronRight } from "lucide-react";
import { getCompany, type CompanyProfilePublic } from "@/data/api/companies.api";
import { ProfilePost } from "./ProfilePost";

interface ProfilePageProps {
  company_id: string;
  onMessage: (ownerId: string) => void;
  isYourSelf?: boolean;
}

export function ProfilePage({ company_id, onMessage, isYourSelf = false }: ProfilePageProps) {
  const [tab, setTab] = useState("pub");
  const [company, setCompany] = useState<CompanyProfilePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      if (!company_id) {
        setError("Company ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCompany(company_id);
        setCompany(data);
      } catch (err) {
        console.error("Failed to load company:", err);
        setError("Не удалось загрузить данные компании");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [company_id]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-red-600">{error || "Компания не найдена"}</div>
      </div>
    );
  }

  const data = {
    title: company?.name ?? "Неизвестная компания",
    type: company?.company_type ?? "Тип не указан",
    email: company?.email ?? "—",
    phone: company?.phone_number ?? "—",
    address: company?.address ?? "—",
    founded: "—", // This field is not in the API response
    tags: ["Услуги", "B2B"], // This field is not in the API response
    achievements: ["Нет данных"], // This field is not in the API response
    description: company?.description ?? "",
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 pb-20">
      <div className="w-full bg-gray-200 h-56 rounded-b-xl" />

      <div className="max-w-6xl w-full px-4 mt-[-48px]">

        {/* Header */}
        <div className="flex items-center gap-4">
          {company?.logo_url && (
            <img
              src={company.logo_url}
              alt="Логотип компании"
              className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md"
            />
          )}

          <div className="flex-1">
            <div className="text-xl font-semibold">{data.title}</div>
            <div className="text-sm text-gray-500">{data.type}</div>
          </div>

          {/* Buttons */}
          {isYourSelf ? (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
              Редактировать профиль
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
                onClick={() => onMessage(company?.owner_id)}
              >
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
          {["pub", "cases", "reviews"].map((t) => (
            <button
              key={t}
              className={`px-3 py-2 ${tab === t
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600"
                }`}
              onClick={() => setTab(t)}
            >
              {t === "pub" ? "Публикации" : t === "cases" ? "Кейсы" : "Отзывы"}
            </button>
          ))}
        </div>

        <div className="flex mt-6 gap-6">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            {tab === "pub" && (
              <ProfilePost company={company} isYourCompany={false} />
            )}
            {tab === "cases" && (
              <div className="bg-white rounded-xl shadow p-4">
                Кейсы компании появятся здесь.
              </div>
            )}

            {tab === "reviews" && (
              <div className="bg-white rounded-xl shadow p-4">
                Пока нет отзывов.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Rating */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <div className="text-lg font-semibold">
                  {company?.average_rating
                    ? company.average_rating.toFixed(1)
                    : "—"}
                </div>
                <div className="text-sm text-gray-500">
                  ({company?.ratings?.length ?? 0} отзывов)
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold text-lg mb-2">О нас</div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {data.description || "Описание компании отсутствует."}
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex gap-2 items-center">
                  <Mail size={16} /> {data.email}
                </div>
                <div className="flex gap-2 items-center">
                  <Phone size={16} /> {data.phone}
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} /> {data.address}
                </div>
                <div className="flex gap-2 items-center">
                  <Globe size={16} /> Основана: {data.founded}
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
                {data.achievements.map((a: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-center">
                    <Award className="text-yellow-500" size={18} /> {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold mb-3">Услуги</div>

              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag: string) => (
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
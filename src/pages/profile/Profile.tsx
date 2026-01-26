import { useState, useEffect } from "react";
import { Star, MapPin, Phone, Mail, Globe, Award, ChevronRight } from "lucide-react";
import { getCompany, createOrUpdateRating, type CompanyProfilePublic } from "@/data/api/companies.api";
import { ProfilePost } from "./ProfilePost";
import { RatingModal } from "@/components/RatingModal";
import { type CompanyMemberPublic } from "@/data/api/companies.api";

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
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [members] = useState<CompanyMemberPublic[]>([]);

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

  const handleRatingSubmit = async (data: { score: number; comment?: string }) => {
    if (!company_id) return;

    try {
      await createOrUpdateRating(company_id, {
        score: data.score,
        comment: data.comment || null,
      });

      // Reload company data to get updated rating
      const updatedCompany = await getCompany(company_id);
      setCompany(updatedCompany);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Не удалось отправить отзыв. Попробуйте снова.");
    }
  };

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
    founded: new Date(company.created_at).getFullYear() ?? "—",
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
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Отзывы и рейтинги</h3>
                  <p className="text-sm text-gray-500">
                    {company?.ratings?.length ?? 0} {(company?.ratings?.length ?? 0) === 1 ? 'отзыв' : 'отзывов'}
                  </p>
                </div>

                {company?.ratings && company.ratings.length > 0 ? (
                  <div className="space-y-4">
                    {company.ratings.map((rating) => {
                      const date = new Date(rating.created_at);
                      const formattedDate = date.toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });

                      return (
                        <div
                          key={rating.id}
                          className="p-5 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                        >
                          {/* Rating Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {/* User Avatar */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                U
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">Пользователь</div>
                                <div className="text-xs text-gray-500">{formattedDate}</div>
                              </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={18}
                                  className={
                                    star <= rating.score
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          {/* Comment */}
                          {rating.comment && (
                            <p className="text-sm text-gray-700 leading-relaxed pl-13">
                              {rating.comment}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Отзывов пока нет
                    </p>
                    <p className="text-xs text-gray-500">
                      Станьте первым, кто оставит отзыв об этой компании
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Members */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Команда</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {(members.length > 0 || company.members?.length)
                      ? `${[...(company.members ?? []), ...members].length} ${[...(company.members ?? []), ...members].length === 1 ? 'участник' : 'участников'}`
                      : 'Добавьте участников команды'}
                  </p>
                </div>
              </div>

              {(members.length > 0 || company.members?.length) ? (
                <div className="grid grid-cols-1 gap-3">
                  {[...(company.members ?? []), ...members].map((member: CompanyMemberPublic) => {
                    const displayName = member.user?.full_name ?? member.user?.email ?? member.user_id;
                    const initials = member.user?.full_name
                      ? member.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : (member.user?.email?.[0] ?? '?').toUpperCase();

                    return (
                      <div
                        key={member.user_id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                          {initials}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {displayName}
                          </div>
                          {member.user?.email && member.user?.full_name && (
                            <div className="text-xs text-gray-500 truncate">
                              {member.user.email}
                            </div>
                          )}
                        </div>

                        {/* Role Badge */}
                        <div className="flex-shrink-0">
                          <span className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                            {member.role || 'Участник'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Участников пока нет
                  </p>
                  <p className="text-xs text-gray-500">
                    Нажмите "Добавить" чтобы пригласить участников
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Rating */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-3">
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

              {!isYourSelf && (
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm"
                >
                  Оставить отзыв
                </button>
              )}
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
                  <Globe size={16} /> В Enterra с: {data.founded}
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

      <RatingModal
        open={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
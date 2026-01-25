import { useState } from "react";
import { Star, Mail, MapPin, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompanyProfile } from "@/hooks/useMyCompanyProfile";
import type { CompanyMemberPublic } from "@/data/api/companies.api";
import { updateCompany } from "@/data/api/companies.api";
import type { CompanyUpdate } from "@/data/api/companies.api";
import { ProfilePost } from "./ProfilePost";
import { AddMemberModal } from "@/components/AddMemberModal";


export const MyCompanyProfilePage = () => {
  const { user } = useAuth();
  const { company, isLoading, error } = useMyCompanyProfile(user?.id);
  const [tab, setTab] = useState<"pub" | "cases" | "reviews">("pub");
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<CompanyUpdate>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<CompanyMemberPublic[]>([]);


  const handleEdit = () => {
    setFormState({
      name: company.name ?? null,
      description: company.description ?? null,
      email: company.email ?? null,
      address: company.address ?? null,
      phone_number: company.phone_number ?? null,
      logo_url: company.logo_url ?? null,
    });
    console.log(formState);
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("Saving", formState);
    try {
      setIsSaving(true);

      const updatedCompany = await updateCompany(company.id, formState);
      console.log("Updated company:", updatedCompany);


      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMemberAdded = (newMember: CompanyMemberPublic) => {
    setMembers((prev) => [...prev, newMember]);
  };



  if (isLoading) return <p>Загрузка…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!company) return <p>Компания не найдена</p>;

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 pb-20">
      {/* Cover */}
      <div className="w-full bg-gray-200 h-56 rounded-b-xl" />

      <div className="max-w-6xl w-full px-4 mt-[-48px]">
        {/* Header */}
        <div className="flex items-center gap-4">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md" />
          )}

          <div className="flex-1">
            <div className="text-xl font-semibold">{company.name}</div>
            <div className="text-sm text-gray-500">
              {company.type ?? "Компания"}
            </div>
          </div>

          {/* Owner buttons */}
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
              >
                Редактировать
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow disabled:opacity-50"
              >
                {isSaving ? "Сохранение…" : "Сохранить"}
              </button>
            )}
          </div>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-500"
            >
              Отмена
            </button>
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
              onClick={() => setTab(t as any)}
            >
              {t === "pub"
                ? "Публикации"
                : t === "cases"
                  ? "Кейсы"
                  : "Отзывы"}
            </button>
          ))}
        </div>

        <div className="flex mt-6 gap-6">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            {tab === "pub" && (
              <ProfilePost company={company} isYourCompany={true} />
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
                    {company.ratings.map((rating: any) => {
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
                      Пока никто не оставил отзыв о вашей компании
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
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-lg leading-none">+</span>
                  Добавить
                </button>
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
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <div className="text-lg font-semibold">
                  {company.average_rating
                    ? company.average_rating.toFixed(1)
                    : "—"}
                </div>
                <div className="text-sm text-gray-500">
                  ({company.ratings?.length ?? 0} отзывов)
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold text-lg mb-2">О компании</div>

              {isEditing ? (
                <textarea
                  value={formState.description ?? ""}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {company.description
                    ?.split("\n")
                    .map((line: string, i: number) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              )}

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {isEditing ? (
                  <input
                    type="email"
                    value={formState.email ?? ""}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, email: e.target.value }))
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Email"
                  />
                ) : (
                  company.email && (
                    <div className="flex gap-2 items-center">
                      <Mail size={16} /> {company.email}
                    </div>
                  )
                )}

                {isEditing ? (
                  <input
                    value={formState.address ?? ""}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, address: e.target.value }))
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Адрес"
                  />
                ) : (
                  company.address && (
                    <div className="flex gap-2 items-center">
                      <MapPin size={16} /> {company.address}
                    </div>
                  )
                )}

                {company.created_at && (
                  <div className="flex gap-2 items-center">
                    <Globe size={16} /> Основана:{" "}
                    {new Date(company.created_at).getFullYear()}
                  </div>
                )}
              </div>

              {/* <button className="mt-3 text-blue-600 text-sm flex items-center gap-1">
                Показать больше <ChevronRight size={16} />
              </button> */}
            </div>

            {/* Tags */}
            {company.tags?.length && (
              <div className="bg-white rounded-xl shadow p-4">
                <div className="font-semibold mb-3">Услуги</div>

                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        open={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        companyId={company.id}
        onMemberAdded={handleMemberAdded}
      />
    </div>
  );
};

import { useState, useRef } from "react";
import { Star, Mail, MapPin, Globe, Phone, Camera, Briefcase, Calendar, Hash, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompanyProfile } from "@/hooks/useMyCompanyProfile";
import type { CompanyMemberPublic } from "@/data/api/companies.api";
import { updateCompany } from "@/data/api/companies.api";
import type { CompanyUpdate } from "@/data/api/companies.api";
import { ProfilePost } from "./ProfilePost";
import { AddMemberModal } from "@/components/AddMemberModal";
import { uploadFile } from "@/data/api/files.api";


export const MyCompanyProfilePage = ({ onOpenPost }: { onOpenPost?: (id: string) => void }) => {
  const { user } = useAuth();
  const { company, isLoading, error } = useMyCompanyProfile(user?.id);
  const [tab, setTab] = useState<"pub" | "cases" | "reviews">("pub");
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<CompanyUpdate>({ tags: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<CompanyMemberPublic[]>([]);
  const tags = isEditing
    ? formState.tags ?? []
    : company?.tags ?? [];
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Cases local state
  const [cases, setCases] = useState<Array<{
    id: string;
    title: string;
    description: string;
    files: Array<{ name: string; url: string; type: string }>;
  }>>([]);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseFiles, setCaseFiles] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const [caseFileUploading, setCaseFileUploading] = useState(false);
  const caseFileInputRef = useRef<HTMLInputElement>(null);

  // OKEDs
  const [newOked, setNewOked] = useState("");
  const [isOkedModalOpen, setIsOkedModalOpen] = useState(false);

  const handleEdit = () => {
    setFormState({
      name: company.name ?? null,
      description: company.description ?? null,
      email: company.email ?? null,
      address: company.address ?? null,
      phone_number: company.phone_number ?? null,
      logo_url: company.logo_url ?? null,
      tags: company.tags ?? [],
      company_type: company.company_type ?? null,
      business_since_year: company.business_since_year ?? null,
      business_area: company.business_area ?? null,
      okeds: company.okeds ?? [],
    });

    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateCompany(company.id, formState);
      setIsEditing(false);
      window.location.reload();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAvatarUploading(true);
      const uploaded = await uploadFile(file);
      setFormState((s) => ({ ...s, logo_url: uploaded.path }));

      // If not editing, save immediately
      if (!isEditing) {
        await updateCompany(company.id, { logo_url: uploaded.path });
        window.location.reload();
      }
    } catch (err) {
      console.error("Avatar upload failed", err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCaseFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setCaseFileUploading(true);
      for (const file of Array.from(files)) {
        const uploaded = await uploadFile(file);
        setCaseFiles((prev) => [
          ...prev,
          { name: file.name, url: uploaded.path, type: file.type },
        ]);
      }
    } catch (err) {
      console.error("Case file upload failed", err);
    } finally {
      setCaseFileUploading(false);
    }
  };

  const handleAddCase = () => {
    if (!caseTitle.trim()) return;
    setCases((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: caseTitle,
        description: caseDescription,
        files: caseFiles,
      },
    ]);
    setCaseTitle("");
    setCaseDescription("");
    setCaseFiles([]);
    setIsAddCaseOpen(false);
  };


  const handleMemberAdded = (newMember: CompanyMemberPublic) => {
    setMembers((prev) => [...prev, newMember]);
  };



  if (isLoading) return <p>Загрузка…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!company) return <p>Компания не найдена</p>;

  const descriptionLength = isEditing ? (formState.description ?? "").length : 0;

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 pb-20">
      {/* Cover */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 h-56 rounded-b-xl" />

      <div className="max-w-6xl w-full px-4 mt-[-48px]">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Avatar with upload */}
          <div className="relative group">
            {(isEditing ? formState.logo_url : company.logo_url) ? (
              <img
                src={(isEditing ? formState.logo_url : company.logo_url) ?? ""}
                alt={company.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg flex items-center justify-center">
                <Building2 size={32} className="text-gray-500" />
              </div>
            )}

            {/* Avatar upload overlay */}
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 w-24 h-24 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
            >
              {avatarUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="flex-1">
            <div className="text-xl font-bold text-gray-900">{company.name}</div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-sm text-gray-500">
                {company.company_type === "customer" ? "Заказчик" :
                  company.company_type === "contractor" ? "Подрядчик" :
                    company.company_type ?? "Компания"}
              </span>

              {tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                >
                  {tag}
                </span>
              ))}

              {isEditing && (
                <button
                  onClick={() => setIsTagModalOpen(true)}
                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-sm flex items-center justify-center transition"
                >
                  +
                </button>
              )}
            </div>

          </div>

          {/* Owner buttons */}
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition font-medium"
              >
                Редактировать
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl shadow-md disabled:opacity-50 hover:bg-green-700 transition font-medium"
                >
                  {isSaving ? "Сохранение…" : "Сохранить"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-gray-200 pb-0">
          {[
            { key: "pub", label: "Публикации" },
            { key: "cases", label: "Кейсы" },
            { key: "reviews", label: "Отзывы" },
          ].map((t) => (
            <button
              key={t.key}
              className={`px-5 py-3 text-sm font-medium transition-all rounded-t-lg ${tab === t.key
                ? "text-blue-600 bg-white border border-gray-200 border-b-white -mb-px"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setTab(t.key as any)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex mt-6 gap-6">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            {tab === "pub" && (
              <ProfilePost company={company} isYourCompany={true} onOpenPost={onOpenPost} />
            )}

            {tab === "cases" && (
              <div className="space-y-4">
                {/* Add Case Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsAddCaseOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  >
                    + Добавить кейс
                  </button>
                </div>

                {/* Add Case Form */}
                {isAddCaseOpen && (
                  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Новый кейс</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                          value={caseTitle}
                          onChange={(e) => setCaseTitle(e.target.value)}
                          placeholder="Название кейса"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание деятельности</label>
                        <textarea
                          value={caseDescription}
                          onChange={(e) => setCaseDescription(e.target.value)}
                          placeholder="Опишите деятельность, результаты, достижения..."
                          rows={4}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Файлы (фото, видео, документы)</label>
                        <div
                          onClick={() => caseFileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition"
                        >
                          {caseFileUploading ? (
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm">Загрузка...</span>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500">Нажмите для загрузки файлов</p>
                              <p className="text-xs text-gray-400 mt-1">Фото, видео, PDF, документы</p>
                            </>
                          )}
                        </div>
                        <input
                          ref={caseFileInputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleCaseFileUpload}
                        />

                        {/* Uploaded files */}
                        {caseFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {caseFiles.map((f, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                {f.type.startsWith("image/") ? (
                                  <img src={f.url} className="w-10 h-10 rounded-lg object-cover" />
                                ) : f.type.startsWith("video/") ? (
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                                    VID
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                    DOC
                                  </div>
                                )}
                                <span className="text-sm text-gray-700 truncate flex-1">{f.name}</span>
                                <button
                                  onClick={() => setCaseFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                  className="text-gray-400 hover:text-red-500 transition text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                      <button
                        onClick={() => {
                          setIsAddCaseOpen(false);
                          setCaseTitle("");
                          setCaseDescription("");
                          setCaseFiles([]);
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleAddCase}
                        disabled={!caseTitle.trim()}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        Создать кейс
                      </button>
                    </div>
                  </div>
                )}

                {/* Cases List */}
                {cases.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {cases.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                        {/* Case media grid */}
                        {c.files.filter((f) => f.type.startsWith("image/")).length > 0 && (
                          <div className="grid grid-cols-3 gap-0.5 max-h-48 overflow-hidden">
                            {c.files.filter((f) => f.type.startsWith("image/")).slice(0, 3).map((f, i) => (
                              <img key={i} src={f.url} className="w-full h-48 object-cover" />
                            ))}
                          </div>
                        )}
                        <div className="p-5">
                          <h4 className="font-semibold text-gray-900 text-lg">{c.title}</h4>
                          {c.description && (
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.description}</p>
                          )}
                          {c.files.filter((f) => !f.type.startsWith("image/")).length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {c.files.filter((f) => !f.type.startsWith("image/")).map((f, i) => (
                                <a
                                  key={i}
                                  href={f.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                  📎 {f.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isAddCaseOpen && (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Кейсов пока нет</p>
                      <p className="text-xs text-gray-500">Добавьте свой первый кейс с фото, видео и описанием</p>
                    </div>
                  )
                )}
              </div>
            )}

            {tab === "reviews" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
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
                          className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 bg-white"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                U
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">Пользователь</div>
                                <div className="text-xs text-gray-500">{formattedDate}</div>
                              </div>
                            </div>

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
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
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
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
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
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 bg-white"
                      >
                        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                          {initials}
                        </div>
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
                        <span className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          {member.role || 'Участник'}
                        </span>
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
          <div className="w-80 space-y-5">
            {/* Rating */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Star className="text-yellow-400 fill-yellow-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {company.average_rating
                      ? company.average_rating.toFixed(1)
                      : "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {company.ratings?.length ?? 0} отзывов
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
              <div className="font-bold text-lg mb-4 text-gray-900">О компании</div>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Описание</label>
                    <textarea
                      value={formState.description ?? ""}
                      maxLength={500}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, description: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                      rows={4}
                      placeholder="Описание компании (до 500 символов)"
                    />
                    <div className={`text-xs text-right mt-1 ${descriptionLength > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {descriptionLength}/500
                    </div>
                  </div>

                  {/* Company Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Статус компании</label>
                    <select
                      value={formState.company_type ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, company_type: (e.target.value || null) as CompanyUpdate['company_type'] }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                    >
                      <option value="">Не указан</option>
                      <option value="customer">Заказчик</option>
                      <option value="contractor">Подрядчик</option>
                      <option value="startup">Стартап</option>
                      <option value="investor">Инвестор</option>
                    </select>
                  </div>

                  {/* Business Since Year */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">В бизнесе с ... года</label>
                    <input
                      type="number"
                      value={formState.business_since_year ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, business_since_year: e.target.value ? parseInt(e.target.value) : null }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                      placeholder="Например: 2015"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </div>

                  {/* Business Area */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Сфера деятельности</label>
                    <input
                      value={formState.business_area ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, business_area: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                      placeholder="Например: IT, Строительство"
                    />
                  </div>

                  {/* OKEDs */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">ОКЭДы</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(formState.okeds ?? []).map((oked, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                          {oked}
                          <button
                            onClick={() => setFormState((s) => ({ ...s, okeds: (s.okeds ?? []).filter((_, idx) => idx !== i) }))}
                            className="text-indigo-400 hover:text-red-500 transition"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setIsOkedModalOpen(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Добавить ОКЭД
                    </button>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={formState.email ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, email: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                      placeholder="Email"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Адрес</label>
                    <input
                      value={formState.address ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, address: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                      placeholder="Адрес"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Телефон</label>
                    <input
                      value={formState.phone_number ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, phone_number: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                      placeholder="Номер телефона"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Description */}
                  {company.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
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

                  <div className="space-y-3">
                    {/* Business Since Year */}
                    {company.business_since_year && (
                      <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Calendar size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">В бизнесе с</div>
                          <div className="text-sm font-medium text-gray-900">{company.business_since_year} года</div>
                        </div>
                      </div>
                    )}

                    {/* Business Area */}
                    {company.business_area && (
                      <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <Briefcase size={14} className="text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Сфера деятельности</div>
                          <div className="text-sm font-medium text-gray-900">{company.business_area}</div>
                        </div>
                      </div>
                    )}

                    {/* OKEDs */}
                    {company.okeds && company.okeds.length > 0 && (
                      <div className="p-3 rounded-xl bg-gray-50">
                        <div className="flex gap-2 items-center mb-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Hash size={14} className="text-indigo-600" />
                          </div>
                          <div className="text-xs text-gray-500">ОКЭДы</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-10">
                          {company.okeds.map((oked: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                              {oked}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact info */}
                    {company.email && (
                      <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                          <Mail size={14} className="text-red-600" />
                        </div>
                        <span className="text-sm text-gray-700">{company.email}</span>
                      </div>
                    )}

                    {company.address && (
                      <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                          <MapPin size={14} className="text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700">{company.address}</span>
                      </div>
                    )}

                    {company.phone_number && (
                      <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Phone size={14} className="text-teal-600" />
                        </div>
                        <span className="text-sm text-gray-700">{company.phone_number}</span>
                      </div>
                    )}

                    {company.created_at && (
                      <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Globe size={14} className="text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                          В Enterra c {new Date(company.created_at).getFullYear()}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Tags */}
            {company.tags?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
                <div className="font-semibold mb-3">Услуги</div>

                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 font-medium"
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

      {/* Modals */}
      <AddMemberModal
        open={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        companyId={company.id}
        onMemberAdded={handleMemberAdded}
      />

      {/* Tag Modal */}
      {isTagModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="font-semibold mb-3">Статус компании</h3>

            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Например: Свободен"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsTagModalOpen(false);
                  setNewTag("");
                }}
                className="text-sm text-gray-500 px-4 py-2"
              >
                Отмена
              </button>

              <button
                onClick={() => {
                  if (!newTag.trim()) return;

                  setFormState((s) => ({
                    ...s,
                    tags: [...(s.tags ?? []), newTag.trim()],
                  }));

                  setNewTag("");
                  setIsTagModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OKED Modal */}
      {isOkedModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="font-semibold mb-3">Добавить ОКЭД</h3>

            <input
              value={newOked}
              onChange={(e) => setNewOked(e.target.value)}
              placeholder="Например: 62.01"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsOkedModalOpen(false);
                  setNewOked("");
                }}
                className="text-sm text-gray-500 px-4 py-2"
              >
                Отмена
              </button>

              <button
                onClick={() => {
                  if (!newOked.trim()) return;

                  setFormState((s) => ({
                    ...s,
                    okeds: [...(s.okeds ?? []), newOked.trim()],
                  }));

                  setNewOked("");
                  setIsOkedModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

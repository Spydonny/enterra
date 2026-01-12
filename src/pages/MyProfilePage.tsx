import { useState } from "react";
import { Star, Mail, MapPin, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMyCompanyProfile } from "@/hooks/useMyCompanyProfile";
import type { CompanyMemberPublic } from "@/data/api/companies.api";
import { updateCompany } from "@/data/api/companies.api";
import type { CompanyUpdate } from "@/data/api/companies.api";


export const MyCompanyProfilePage = () => {
  const { user } = useAuth();
  const { company, isLoading, error } = useMyCompanyProfile(user?.id);
  const [tab, setTab] = useState<"pub" | "cases" | "reviews">("pub");
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<CompanyUpdate>({});
  const [isSaving, setIsSaving] = useState(false);

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
              className={`px-3 py-2 ${
                tab === t
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
              <div className="bg-white rounded-xl shadow p-4">
                Публикации компании появятся здесь.
              </div>
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

            {/* Members */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Участники</h3>

              {company.members?.length ? (
                <ul className="space-y-2">
                  {company.members.map((member: CompanyMemberPublic) => (
                    <li
                      key={member.user_id}
                      className="flex justify-between text-sm border-b pb-2"
                    >
                      <span>
                        {member.user?.full_name ??
                          member.user?.email ??
                          member.user_id}
                      </span>
                      <span className="text-gray-500">
                        {member.role}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  Участников пока нет
                </p>
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
                  {company.rating ?? "—"}
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
                  {company.description || "Описание отсутствует."}
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
    </div>
  );
};

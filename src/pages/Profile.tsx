// src/pages/CompanyProfilePage.tsx
import { useParams } from "react-router-dom";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useAuth } from "@/hooks/useAuth"; // откуда берешь current user

export const CompanyProfilePage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user } = useAuth(); // user.id

  const {
    company,
    isLoading,
    error,
    isYourself,
  } = useCompanyProfile(companyId ?? null, user?.id ?? null);

  if (isLoading) {
    return <p>Загрузка…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!company) {
    return <p>Компания не найдена</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt={company.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
        )}

        <div>
          <h1 className="text-2xl font-semibold">
            {company.name}
          </h1>
          {company.description && (
            <p className="text-gray-600">
              {company.description}
            </p>
          )}
        </div>
      </div>

      {isYourself && (
        <div className="p-4 border rounded-xl bg-gray-50">
          <p className="font-medium">
            Вы владелец этой компании
          </p>

          {/* кнопки управления */}
          <div className="mt-3 flex gap-2">
            <button className="btn-primary">
              Редактировать
            </button>
            <button className="btn-danger">
              Удалить
            </button>
          </div>
        </div>
      )}

      {/* Участники */}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Участники
        </h2>

        <ul className="space-y-2">
          {company.members.map((member) => (
            <li
              key={member.user_id}
              className="flex justify-between border p-2 rounded"
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
      </section>
    </div>
  );
};

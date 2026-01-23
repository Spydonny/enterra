import React, { useState, useEffect } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { getCompanies, type CompanyPublic } from "@/data/api/companies.api";

type Props = {
  onContact: (id: string) => void;
  onNavigate: (route: string) => void;
  onOpenProfile: (company_id: string) => void;
};

export const Home: React.FC<Props> = ({
  onContact,
  onNavigate,
  onOpenProfile,
}) => {
  const [companies, setCompanies] = useState<CompanyPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setIsLoading(true);
        const data = await getCompanies(0, 100);
        setCompanies(data.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load companies:", err);
        setError("Не удалось загрузить компании");
      } finally {
        setIsLoading(false);
      }
    }

    loadCompanies();
  }, []);

  return (
    <div className="p-10">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-gray-900">
          Бизнес Платформа Казахстана
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Объединяем B2B-услуги и инвестиционные возможности, создавая
          комфортную бизнес-среду и новые точки роста.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => onNavigate("contractors")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-[15px] font-medium shadow-md transition-all"
          >
            Найти исполнителя →
          </button>

          <button
            onClick={() => onNavigate("startup-investor")}
            className="border border-gray-300 px-7 py-3.5 rounded-xl text-[15px] hover:bg-gray-50 font-medium transition-all shadow-sm"
          >
            Найти стартап →
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <p className="text-gray-500">Загрузка компаний...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && !error && (
        <div
          className="
            grid
            gap-5
            mt-1
            justify-center
            [grid-template-columns:repeat(auto-fit,minmax(360px,1fr))]
          "
        >
          {companies.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenProfile(c.id)}
              className="
                relative
                w-[360px]
                h-[220px]
                cursor-pointer
              "
            >
              <CompanyCard company={c} onContact={onContact} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

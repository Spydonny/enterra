import React from "react";
import type { Company } from "../types";
import { CompanyCard } from "../components/CompanyCard";

type Props = {
  companies: Company[];
  onContact: (id: string) => void;
  onNavigate: (route: string) => void;
  onOpenProfile: (company: Company) => void;
};

export const Home: React.FC<Props> = ({
  companies,
  onContact,
  onNavigate,
  onOpenProfile,
}) => {
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

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        {companies.map((c) => (
          <div key={c.id} onClick={() => onOpenProfile(c)}>
            <CompanyCard company={c} onContact={onContact} />
          </div>
        ))}
      </div>
    </div>
  );
};

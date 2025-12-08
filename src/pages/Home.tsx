import React from "react";
import type { Company } from "../types";
import { CompanyCard } from "../components/CompanyCard";

type Props = {
  companies: Company[];
  onContact: (id: string) => void;
  onNavigate: (route: string) => void;
};

export const Home: React.FC<Props> = ({ companies, onContact, onNavigate }) => {
  return (
    <div className="p-10">

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-gray-900">
          Бизнес Платформа Казахстана
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Объединяем B2B-услуги и инвестиционные возможности, 
          создавая комфортную бизнес-среду и новые точки роста для компаний Казахстана
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => onNavigate("contractors")}
            className="
              bg-blue-600 hover:bg-blue-700 
              text-white px-7 py-3.5 rounded-xl 
              text-[15px] font-medium shadow-md 
              transition-all
            "
          >
            Найти исполнителя / подрядчика →
          </button>

          <button
            onClick={() => onNavigate("startup-investor")}
            className="
              border border-gray-300 
              px-7 py-3.5 rounded-xl text-[15px] 
              hover:bg-gray-50 font-medium
              transition-all shadow-sm
            "
          >
            Найти стартап / инвестора →
          </button>

        </div>
      </div>

      {/* Title + filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          Популярные компании и стартапы
        </h2>

        <div className="flex gap-3 items-center">
          <div className="text-sm text-gray-600">Сортировать:</div>
          <select
            className="
              border border-gray-300 rounded-lg px-3 py-2 text-sm
              bg-white shadow-sm hover:shadow transition-all
            "
          >
            <option>По популярности</option>
            <option>По времени регистрации</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-8 mt-8">
        {companies.map((c) => (
          <CompanyCard key={c.id} company={c} onContact={onContact} />
        ))}
      </div>
    </div>
  );
};

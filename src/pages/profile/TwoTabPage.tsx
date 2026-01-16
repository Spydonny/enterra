import React, { useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import type { CompanyPublic } from "@/data/api/companies.api";

type Props = {
  title: string;
  tab1Label: string;
  tab2Label: string;
  tab1Data: CompanyPublic[];
  tab2Data: CompanyPublic[];
  onContact: (id: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export const TwoTabsPage: React.FC<Props> = ({
  title,
  tab1Label,
  tab2Label,
  tab1Data,
  tab2Data,
  onContact,
  onBack,
  isLoading = false,
  error = null,
}) => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

  return (
    <div className="p-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          aria-label="Назад"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Назад</span>
        </button>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
          {title}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Выберите категорию и найдите подходящую компанию
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 border-b pb-2">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${activeTab === "tab1"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {tab1Label}
        </button>

        <button
          onClick={() => setActiveTab("tab2")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${activeTab === "tab2"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {tab2Label}
        </button>
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
        <div className="grid grid-cols-3 gap-8">
          {(activeTab === "tab1" ? tab1Data : tab2Data).map((c) => (
            <CompanyCard key={c.id} company={c} onContact={onContact} />
          ))}
        </div>
      )}
    </div>
  );
};

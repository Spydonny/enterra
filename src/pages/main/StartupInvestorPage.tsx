import React, { useState, useEffect } from "react";
import { TwoTabsPage } from "@/pages/profile/TwoTabPage";
import { getCompanies, type CompanyPublic } from "@/data/api/companies.api";

type Props = {
  onContact: (id: string) => void;
  onBack: () => void;
};

export const StartupInvestorPage: React.FC<Props> = ({ onContact, onBack }) => {
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

  const startups = companies.filter((c) => c.company_type === "startup");
  const investors = companies.filter((c) => c.company_type === "investor");

  return (
    <TwoTabsPage
      title="Стартапы и Инвесторы"
      tab1Label="Стартапы"
      tab2Label="Инвесторы"
      tab1Data={startups}
      tab2Data={investors}
      onContact={onContact}
      onBack={onBack}
      isLoading={isLoading}
      error={error}
    />
  );
};

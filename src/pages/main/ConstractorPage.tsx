import React, { useState, useEffect } from "react";
import { TwoTabsPage } from "@/pages/profile/TwoTabPage";
import { getCompanies, type CompanyPublic } from "@/data/api/companies.api";

type Props = {
  onContact: (id: string) => void;
  onBack: () => void;
};

export const ContractorsPage: React.FC<Props> = ({ onContact, onBack }) => {
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

  const executors = companies.filter((c) => c.company_type === "executor");
  const contractors = companies.filter((c) => c.company_type === "contractor");

  return (
    <TwoTabsPage
      title="Исполнители и Подрядчики"
      tab1Label="Исполнители"
      tab2Label="Подрядчики"
      tab1Data={executors}
      tab2Data={contractors}
      onContact={onContact}
      onBack={onBack}
      isLoading={isLoading}
      error={error}
    />
  );
};

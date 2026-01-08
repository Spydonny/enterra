import { useEffect, useState } from "react";
import { getCompanyByOwnerID } from "@/data/api/companies.api";

export const useMyCompanyProfile = (ownerId?: string) => {
  const [company, setCompany] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) return;

    let cancelled = false;

    const loadCompany = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getCompanyByOwnerID(ownerId);
        if (!cancelled) {
          setCompany(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка загрузки");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCompany();

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  return {
    company,
    isLoading,
    error,
  };
};

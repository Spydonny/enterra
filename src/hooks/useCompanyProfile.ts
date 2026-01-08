import { useEffect, useMemo, useState } from "react";
import { getCompany } from "@/data/api/companies.api";
import type { CompanyProfilePublic, UUID } from "@/data/api/companies.api";

type UseCompanyProfileResult = {
  company: CompanyProfilePublic | null;
  isLoading: boolean;
  error: string | null;
  isYourself: boolean;
};

export function useCompanyProfile(
  companyId: UUID | null,
  currentUserId: UUID | null
): UseCompanyProfileResult {
  const [company, setCompany] = useState<CompanyProfilePublic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;

    const loadCompany = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getCompany(companyId);

        if (!cancelled) {
          setCompany(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Не удалось загрузить профиль компании");
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
  }, [companyId]);

  const isYourself = useMemo(() => {
    if (!company || !currentUserId) return false;
    return company.owner_id === currentUserId;
  }, [company, currentUserId]);

  return {
    company,
    isLoading,
    error,
    isYourself,
  };
}

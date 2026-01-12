import { useEffect, useState } from "react";
import { getCompanyByOwnerID } from "@/data/api/companies.api";
import type { CompanyProfilePublic } from "@/data/api/companies.api";
import type { UUID } from "@/types.d.ts";

export function useMyCompany(ownerId?: UUID) {
  const [company, setCompany] = useState<CompanyProfilePublic | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ownerId) return;

    setLoading(true);
    getCompanyByOwnerID(ownerId)
      .then(setCompany)
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
  }, [ownerId]);

  return { company, loading };
}

import React from "react";
import type { CompanyPublic } from "@/data/api/companies.api";

type Props = {
  company: CompanyPublic;
  onContact: (id: string) => void;
};

export const CompanyCard: React.FC<Props> = ({ company, onContact }) => {
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContact(company.id);
  };

  return (
    <div
      className="
        h-full
        border border-gray-200/70
        rounded-2xl
        bg-white/80
        backdrop-blur-sm
        shadow-sm hover:shadow-md
        transition-all
        p-5
        flex flex-col
      "
    >
      {/* Top content */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div
          className="
            w-20 h-20 rounded-xl
            bg-gradient-to-br from-gray-200 to-gray-300
            border border-gray-300
            shadow-inner
            flex items-center justify-center
            text-sm text-gray-600
            shrink-0
            overflow-hidden
          "
        >
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          ) : (
            "Фото"
          )}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="font-semibold text-lg text-gray-900 leading-snug">
                {company.name}
              </div>

              {company.company_type && (
                <div className="text-sm text-gray-500 mt-0.5 capitalize">
                  {company.company_type}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <div className="mt-3 text-sm text-gray-600 line-clamp-2">
              {company.description}
            </div>
          )}

          {/* Contact info */}
          {(company.email || company.phone_number) && (
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              {company.email && <div>📧 {company.email}</div>}
              {company.phone_number && <div>📞 {company.phone_number}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-auto pt-5 flex gap-3">
        <button
          onClick={handleContactClick}
          className="
          
            flex-1
            py-2.5
            bg-blue-600 hover:bg-blue-700
            text-white rounded-xl
            text-sm font-medium
            shadow-sm hover:shadow
            transition-all
          "
        >
          Связаться
        </button>

        <button
          className="
            flex-1
            py-2.5
            border border-gray-300
            rounded-xl
            text-sm text-gray-700
            hover:bg-gray-100
            transition-all
            shadow-sm hover:shadow
          "
        >
          Поделиться
        </button>
      </div>
    </div>
  );
};

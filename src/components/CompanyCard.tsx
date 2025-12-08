import React from "react";
import type { Company } from "../types";

type Props = { company: Company; onContact: (id: string) => void };

export const CompanyCard: React.FC<Props> = ({ company, onContact }) => {
  return (
    <div
      className="
        border border-gray-200/70 
        rounded-2xl 
        p-6 
        bg-white/80 
        backdrop-blur-sm 
        shadow-sm hover:shadow-md 
        transition-all
      "
    >
      <div className="flex gap-5">
        {/* Avatar */}
        <div
          className="
            w-20 h-20 rounded-xl 
            bg-gradient-to-br from-gray-200 to-gray-300
            border border-gray-300
            shadow-inner flex items-center justify-center
            text-sm text-gray-600
          "
        >
          Фото
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-xl text-gray-900 leading-tight">
                {company.name}
              </div>

              <div className="text-sm text-gray-500 mt-1">
                {company.type}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-yellow-600">
                ★★★★★ {company.ratingUsers}
              </div>

              <div className="text-xs text-gray-500">
                Enterra: {company.ratingEnterra}/10
              </div>
            </div>
          </div>

          {/* Leader + Tags */}
          <div className="mt-4">
            <div className="text-sm text-gray-700">
              Руководитель: <b>{company.leader}</b>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {company.tags.map((t) => (
                <span
                  key={t}
                  className="
                    text-xs px-3 py-1 rounded-full 
                    bg-gray-100 border border-gray-200
                  "
                >
                  {t}
                </span>
              ))}

              {/* Status */}
              <span
                className={`
                  text-xs px-3 py-1 rounded-full border 
                  ${
                    company.status === "свободен"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : company.status === "в процессе сделки"
                      ? "bg-orange-50 border-orange-200 text-orange-700"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }
                `}
              >
                {company.status}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center gap-3">
            <button
              className="
                px-5 py-2.5 
                bg-blue-600 hover:bg-blue-700 
                text-white rounded-xl 
                text-sm font-medium
                shadow-sm hover:shadow
                transition-all
              "
              onClick={() => onContact(company.id)}
            >
              Связаться
            </button>

            <button
              className="
                px-4 py-2 
                border border-gray-300 rounded-xl 
                text-sm text-gray-700 
                hover:bg-gray-100
                transition-all shadow-sm hover:shadow
              "
            >
              Поделиться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

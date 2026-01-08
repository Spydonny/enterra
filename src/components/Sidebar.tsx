import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Newspaper,
  MessageSquare,
  FileText,
  Settings,
  UserRound
} from "lucide-react";

import { logout } from "@/data/api/auth.api";
import { getMe } from "@/data/api/user.api";
import { getCompanyByOwnerID } from "@/data/api/companies.api";
import type { UserPublic, CompanyProfilePublic } from "@/data/api/companies.api";

type SidebarProps = { 
  route: string; 
  onNavigate: (r: string) => void;
  isLoggedIn?: boolean;
};

export const Sidebar: React.FC<SidebarProps> = ({
  route,
  onNavigate,
  isLoggedIn = true
}) => {
  const [open, setOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // 🔽 добавлено (логика)
  const [user, setUser] = useState<UserPublic | null>(null);
  const [company, setCompany] = useState<CompanyProfilePublic | null>(null);

  const items = [
    { key: "home", label: "Главная", icon: <Home size={18} /> },
    { key: "profile", label: "Профиль", icon: <UserRound size={18} /> },
    { key: "feed", label: "Лента новостей", icon: <Newspaper size={18} /> },
    { key: "messages", label: "Сообщения", icon: <MessageSquare size={18} /> },
    { key: "docs", label: "Документы", icon: <FileText size={18} /> },
  ];

  // закрывать по клику вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔽 загрузка данных
  useEffect(() => {
    if (!isLoggedIn) return;

    async function load() {
      try {
        const me = await getMe();
        setUser(me);

        try {
          const company = await getCompanyByOwnerID(me.id);
          setCompany(company);
        } catch {
          setCompany(null);
        }
      } catch {
        setUser(null);
        setCompany(null);
      }
    }

    load();
  }, [isLoggedIn]);

  return (
    <aside
      className="
        w-64 h-screen fixed left-0 top-0 
        bg-white shadow-lg border-r border-gray-200 
        flex flex-col
      "
    >
      {/* User block */}
      <div className="relative p-6 flex items-center gap-3 border-b border-gray-200">
        <img
          src={company?.logo_url ?? "/company-logo-placeholder.png"}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-gray-900">
            {user?.full_name ?? user?.email ?? "—"}
          </div>
          {/*Company name */}
          <div className="text-xs text-gray-500">
            {company?.name ?? "Компания не создана"}
          </div> 
        </div>

        {/* Settings button + popover */}
        <div ref={settingsRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          {open && (
            <div
              className="
                absolute right-0 mt-2 w-40 
                bg-white shadow-md border border-gray-200 
                rounded-xl p-2 z-20
              "
            >
              <button
                className="
                  w-full text-left px-3 py-2 rounded-lg 
                  hover:bg-gray-100 text-[14px]
                "
                onClick={() => {
                  setOpen(false);
                  if (isLoggedIn) {
                    logout().then(() => {
                      window.location.reload();
                    });
                  } else {
                    console.log("Login...");
                  }
                }}
              >
                {isLoggedIn ? "Выйти" : "Войти"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = route === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onNavigate(it.key)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                text-left text-[15px] tracking-wide transition-all duration-150
                ${
                  active
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100/60"
                }
              `}
            >
              {it.icon}
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

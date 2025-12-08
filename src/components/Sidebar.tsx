import React from "react";
import {
  Home,
  Newspaper,
  MessageSquare,
  FileText,
  Settings,
  UserRound
} from "lucide-react";

type SidebarProps = { route: string; onNavigate: (r: string) => void };

export const Sidebar: React.FC<SidebarProps> = ({ route, onNavigate }) => {
  const items = [
    { key: "home", label: "Главная", icon: <Home size={18} /> },
    { key: "profile", label: "Профиль", icon: <UserRound size={18} /> },
    { key: "feed", label: "Лента новостей", icon: <Newspaper size={18} /> },
    { key: "messages", label: "Сообщения", icon: <MessageSquare size={18} /> },
    { key: "docs", label: "Документы", icon: <FileText size={18} /> },
  ];

  return (
    <aside
      className="
        w-64 h-screen fixed left-0 top-0 
        bg-white shadow-lg border-r border-gray-200 
        flex flex-col
      "
    >
      {/* User block */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-200">
        <img
          src="/avatar.jpg"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-gray-900">
            Jane Labadin
          </div>
          <div className="text-xs text-gray-500">@jane_labadin</div>
        </div>
        <Settings size={20} className="text-gray-600" />
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

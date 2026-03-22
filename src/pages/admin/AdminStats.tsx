import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Building2,
  Search,
  ArrowUpDown,
  RefreshCw,
  X,
} from "lucide-react";
import {
  getOverview,
  getUsersStats,
  getSectionClicks,
  getDauHistory,
  type PlatformOverview,
  type UserRow,
  type SectionClickStats,
  type DauPoint,
  type Period,
} from "@/data/api/admin.api";

/* ─── Period filter config ─── */
const PERIODS: { key: Period; label: string }[] = [
  { key: "day", label: "День" },
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
  { key: "year", label: "Год" },
  { key: "all", label: "Всё время" },
];

const DAU_DAYS: Record<Period, number> = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
  all: 365,
};

/* ─── Section labels ─── */
const SECTION_LABELS: Record<string, string> = {
  home: "Главная",
  feed: "Лента",
  messages: "Сообщения",
  "profile-me": "Мой профиль",
  profile: "Профиль",
  contractors: "Подрядчики",
  "startup-investor": "Стартапы",
  "admin-stats": "Статистика",
  docs: "Документы",
  post: "Пост",
};

/* ─── DAU Sparkline (canvas) ─── */
const SparklineChart: React.FC<{
  data: DauPoint[];
  width?: number;
  height?: number;
}> = ({ data, width = 700, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const values = data.map((d) => d.count);
    const max = Math.max(...values, 1);
    const padY = 28;
    const padX = 44;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    // Grid
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padY + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(width - padX, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(Math.round(max - (max / 4) * i)), padX - 8, y + 4);
    }

    const pts = values.map((v, i) => ({
      x: padX + (i / Math.max(values.length - 1, 1)) * chartW,
      y: padY + chartH - (v / max) * chartH,
    }));

    // Fill
    const gradient = ctx.createLinearGradient(0, padY, 0, height - padY);
    gradient.addColorStop(0, "rgba(37, 99, 235, 0.15)");
    gradient.addColorStop(1, "rgba(37, 99, 235, 0.0)");

    ctx.beginPath();
    ctx.moveTo(pts[0].x, height - padY);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, height - padY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Dots
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Date labels
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      if (i % Math.max(Math.floor(data.length / 7), 1) === 0 || i === data.length - 1) {
        ctx.fillText(d.date.slice(5), pts[i].x, height - padY + 16);
      }
    });
  }, [data, width, height]);

  return (
    <canvas ref={canvasRef} style={{ width, height }} className="block w-full" />
  );
};

/* ─── Section bars ─── */
const SectionBars: React.FC<{ data: SectionClickStats[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.clicks), 1);
  const colors = [
    "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500",
    "bg-sky-500", "bg-teal-500", "bg-emerald-500", "bg-amber-500",
    "bg-rose-500", "bg-orange-500",
  ];

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.section} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-28 truncate text-right">
            {SECTION_LABELS[d.section] ?? d.section}
          </span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
              style={{ width: `${(d.clicks / max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700 w-10 text-right tabular-nums">
            {d.clicks}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Metric card ─── */
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className={`inline-flex p-2.5 rounded-xl ${color} mb-3`}>{icon}</div>
    <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
    <div className="text-sm text-gray-500 mt-0.5">{label}</div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export const AdminStats: React.FC = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [overview, setOverview] = useState<PlatformOverview | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [sections, setSections] = useState<SectionClickStats[]>([]);
  const [dau, setDau] = useState<DauPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof UserRow>("email");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  async function loadAll(p: Period) {
    try {
      setLoading(true);
      setError(null);
      const [ov, us, sc, da] = await Promise.all([
        getOverview(p),
        getUsersStats(p),
        getSectionClicks(p),
        getDauHistory(DAU_DAYS[p]),
      ]);
      setOverview(ov);
      setUsers(us.data);
      setSections(sc);
      setDau(da);
    } catch (err: any) {
      console.error(err);
      setError("Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll(period);
  }, [period]);

  // Sort / filter
  const filteredUsers = users
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        (u.full_name ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (typeof av === "number" && typeof bv === "number")
        return sortAsc ? av - bv : bv - av;
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  function toggleSort(field: keyof UserRow) {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={28} className="text-blue-600 animate-spin" />
          <span className="text-gray-500 text-sm">Загрузка статистики…</span>
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => loadAll(period)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-sm"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const ov = overview!;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
            <BarChart3 size={22} className="text-blue-600" />
            Панель администратора
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Аналитика платформы
          </p>
        </div>
        <button
          onClick={() => loadAll(period)}
          className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition"
          title="Обновить"
        >
          <RefreshCw size={16} />
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">
        {/* ── Period filter tabs ── */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1.5 w-fit shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${
                  period === p.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Overview cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            icon={<Users size={18} className="text-blue-600" />}
            label="Всего пользователей"
            value={ov.total_users}
            color="bg-blue-50"
          />
          <MetricCard
            icon={<Activity size={18} className="text-emerald-600" />}
            label="Активных сегодня"
            value={ov.active_users_today}
            color="bg-emerald-50"
          />
          <MetricCard
            icon={<TrendingUp size={18} className="text-violet-600" />}
            label="Активных за период"
            value={ov.new_users_this_month}
            color="bg-violet-50"
          />
          <MetricCard
            icon={<BarChart3 size={18} className="text-amber-600" />}
            label="Всего публикаций"
            value={ov.total_posts}
            color="bg-amber-50"
          />
          <MetricCard
            icon={<MessageSquare size={18} className="text-rose-600" />}
            label="Всего сообщений"
            value={ov.total_messages}
            color="bg-rose-50"
          />
          <MetricCard
            icon={<Building2 size={18} className="text-cyan-600" />}
            label="Всего компаний"
            value={ov.total_companies}
            color="bg-cyan-50"
          />
        </section>

        {/* ── Charts row ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* DAU chart */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              Активные пользователи в день
            </h2>
            {dau.length > 0 ? (
              <SparklineChart data={dau} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных за выбранный период
              </div>
            )}
          </div>

          {/* Section clicks */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-violet-600" />
              Популярность разделов
            </h2>
            {sections.length > 0 ? (
              <SectionBars data={sections} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных за выбранный период
              </div>
            )}
          </div>
        </section>

        {/* ── Users table ── */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Пользователи
              <span className="text-xs text-gray-400 font-normal ml-2">
                {filteredUsers.length} из {users.length}
              </span>
            </h2>
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Поиск по имени или email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-9 pr-4 py-2.5 rounded-xl
                  border border-gray-300/70 bg-white
                  text-sm text-gray-700 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                  transition shadow-sm
                "
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wider bg-gray-50/60">
                  {([
                    ["email", "Email"],
                    ["full_name", "Имя"],
                    ["monthly_logins", "Входов"],
                    ["avg_time_minutes", "Сред. время (мин)"],
                    ["likes_count", "Лайки"],
                    ["messages_count", "Сообщения"],
                    ["is_active", "Статус"],
                  ] as [keyof UserRow, string][]).map(([field, label]) => (
                    <th
                      key={field}
                      onClick={() => toggleSort(field)}
                      className="px-6 py-3 text-left font-medium cursor-pointer hover:text-gray-700 transition select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="hover:bg-blue-50/40 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {u.full_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 tabular-nums">
                      {u.monthly_logins}
                    </td>
                    <td className="px-6 py-4 text-gray-600 tabular-nums">
                      {u.avg_time_minutes}
                    </td>
                    <td className="px-6 py-4 text-gray-600 tabular-nums">
                      {u.likes_count}
                    </td>
                    <td className="px-6 py-4 text-gray-600 tabular-nums">
                      {u.messages_count}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${u.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {u.is_active ? "Активен" : "Неактивен"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── User detail modal ── */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white border border-gray-200 rounded-2xl
              w-full max-w-md p-8
              shadow-xl
            "
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedUser.full_name ?? selectedUser.email}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedUser.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {([
                ["Входов за период", selectedUser.monthly_logins],
                ["Сред. время (мин)", selectedUser.avg_time_minutes],
                ["Лайки", selectedUser.likes_count],
                ["Сообщения", selectedUser.messages_count],
              ] as [string, number][]).map(([label, val]) => (
                <div
                  key={label}
                  className="rounded-xl bg-gray-50 border border-gray-200 p-4"
                >
                  <div className="text-2xl font-bold text-gray-900 tabular-nums">
                    {val}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Статус:</span>
              <span
                className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${selectedUser.is_active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                  }
                `}
              >
                {selectedUser.is_active ? "Активен" : "Неактивен"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

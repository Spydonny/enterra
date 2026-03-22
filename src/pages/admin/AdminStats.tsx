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
} from "@/data/api/admin.api";

/* ─── Mini Sparkline chart (canvas) ─── */
const SparklineChart: React.FC<{
  data: DauPoint[];
  width?: number;
  height?: number;
}> = ({ data, width = 700, height = 220 }) => {
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
    const padY = 30;
    const padX = 50;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padY + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(width - padX, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(
        String(Math.round(max - (max / 4) * i)),
        padX - 8,
        y + 4
      );
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padY, 0, height - padY);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");

    const pts = values.map((v, i) => ({
      x: padX + (i / Math.max(values.length - 1, 1)) * chartW,
      y: padY + chartH - (v / max) * chartH,
    }));

    // Fill area
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
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Dots
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#818cf8";
      ctx.fill();
    });

    // Date labels (show every 5th)
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      if (i % 5 === 0 || i === data.length - 1) {
        const label = d.date.slice(5); // "MM-DD"
        ctx.fillText(label, pts[i].x, height - padY + 16);
      }
    });
  }, [data, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
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

/* ─── Donut chart for sections ─── */
const SectionDonut: React.FC<{ data: SectionClickStats[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = [
    "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd",
    "#60a5fa", "#38bdf8", "#34d399", "#fbbf24",
    "#f87171", "#fb923c",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 180;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const total = data.reduce((s, d) => s + d.clicks, 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const r = 70;
    const inner = 45;

    let angle = -Math.PI / 2;
    data.forEach((d, i) => {
      const sweep = (d.clicks / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      ctx.arc(cx, cy, r, angle, angle + sweep);
      ctx.arc(cx, cy, inner, angle + sweep, angle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      angle += sweep;
    });

    // center text
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "bold 22px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(total), cx, cy - 6);
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("кликов", cx, cy + 14);
  }, [data]);

  return (
    <div className="flex items-center gap-6">
      <canvas
        ref={canvasRef}
        style={{ width: 180, height: 180 }}
        className="block shrink-0"
      />
      <div className="space-y-1.5 text-sm">
        {data.map((d, i) => (
          <div key={d.section} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-gray-300">
              {SECTION_LABELS[d.section] ?? d.section}
            </span>
            <span className="text-gray-500 ml-auto tabular-nums">
              {d.clicks}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Overview metric card ─── */
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}> = ({ icon, label, value, accent }) => (
  <div
    className={`
      relative overflow-hidden rounded-2xl p-6
      bg-gradient-to-br ${accent}
      border border-white/[0.06]
      shadow-lg shadow-black/20
      transition-transform duration-200 hover:scale-[1.02]
    `}
  >
    {/* glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    <div className="text-sm text-white/60 mt-1">{label}</div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export const AdminStats: React.FC = () => {
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

  // ----- load -----
  async function loadAll() {
    try {
      setLoading(true);
      setError(null);
      const [ov, us, sc, da] = await Promise.all([
        getOverview(),
        getUsersStats(),
        getSectionClicks(),
        getDauHistory(30),
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
    loadAll();
  }, []);

  // ----- sort / filter -----
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

  // ----- render -----
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={32} className="text-indigo-400 animate-spin" />
          <span className="text-gray-400 text-sm">Загрузка статистики…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadAll}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const ov = overview!;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0f1117]/80 border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 size={24} className="text-indigo-400" />
            Панель администратора
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Аналитика платформы в реальном времени
          </p>
        </div>
        <button
          onClick={loadAll}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          title="Обновить"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">
        {/* ── Overview cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            icon={<Users size={20} className="text-blue-300" />}
            label="Всего пользователей"
            value={ov.total_users}
            accent="from-blue-900/40 to-blue-950/60"
          />
          <MetricCard
            icon={<Activity size={20} className="text-emerald-300" />}
            label="Активных сегодня"
            value={ov.active_users_today}
            accent="from-emerald-900/40 to-emerald-950/60"
          />
          <MetricCard
            icon={<TrendingUp size={20} className="text-violet-300" />}
            label="Новых за месяц"
            value={ov.new_users_this_month}
            accent="from-violet-900/40 to-violet-950/60"
          />
          <MetricCard
            icon={<BarChart3 size={20} className="text-amber-300" />}
            label="Всего публикаций"
            value={ov.total_posts}
            accent="from-amber-900/40 to-amber-950/60"
          />
          <MetricCard
            icon={<MessageSquare size={20} className="text-rose-300" />}
            label="Всего сообщений"
            value={ov.total_messages}
            accent="from-rose-900/40 to-rose-950/60"
          />
          <MetricCard
            icon={<Building2 size={20} className="text-cyan-300" />}
            label="Всего компаний"
            value={ov.total_companies}
            accent="from-cyan-900/40 to-cyan-950/60"
          />
        </section>

        {/* ── Charts row ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* DAU chart */}
          <div className="lg:col-span-3 rounded-2xl bg-[#161923] border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" />
              Активные пользователи в день
              <span className="text-xs text-gray-500 ml-2 font-normal">
                последние 30 дней
              </span>
            </h2>
            {dau.length > 0 ? (
              <SparklineChart data={dau} />
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-600 text-sm">
                Нет данных
              </div>
            )}
          </div>

          {/* Section clicks */}
          <div className="lg:col-span-2 rounded-2xl bg-[#161923] border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-violet-400" />
              Популярность разделов
            </h2>
            {sections.length > 0 ? (
              <SectionDonut data={sections} />
            ) : (
              <div className="h-[180px] flex items-center justify-center text-gray-600 text-sm">
                Нет данных
              </div>
            )}
          </div>
        </section>

        {/* ── Users table ── */}
        <section className="rounded-2xl bg-[#161923] border border-white/[0.06] overflow-hidden">
          <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              Пользователи
              <span className="text-xs text-gray-500 font-normal ml-2">
                {filteredUsers.length} из {users.length}
              </span>
            </h2>
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Поиск по имени или email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-9 pr-4 py-2.5 rounded-xl
                  bg-white/[0.04] border border-white/[0.08]
                  text-sm text-gray-200 placeholder:text-gray-600
                  focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30
                  transition
                "
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-white/[0.06] text-gray-500 text-xs uppercase tracking-wider">
                  {([
                    ["email", "Email"],
                    ["full_name", "Имя"],
                    ["monthly_logins", "Входов/мес"],
                    ["avg_time_minutes", "Сред. время (мин)"],
                    ["likes_count", "Лайки"],
                    ["messages_count", "Сообщения"],
                    ["is_active", "Статус"],
                  ] as [keyof UserRow, string][]).map(([field, label]) => (
                    <th
                      key={field}
                      onClick={() => toggleSort(field)}
                      className="px-6 py-3 text-left font-medium cursor-pointer hover:text-gray-300 transition select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <ArrowUpDown size={12} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="hover:bg-white/[0.03] cursor-pointer transition"
                  >
                    <td className="px-6 py-4 text-gray-200">{u.email}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {u.full_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 tabular-nums">
                      {u.monthly_logins}
                    </td>
                    <td className="px-6 py-4 text-gray-300 tabular-nums">
                      {u.avg_time_minutes}
                    </td>
                    <td className="px-6 py-4 text-gray-300 tabular-nums">
                      {u.likes_count}
                    </td>
                    <td className="px-6 py-4 text-gray-300 tabular-nums">
                      {u.messages_count}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${u.is_active
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
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
                      className="px-6 py-12 text-center text-gray-600"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-[#1a1d2e] border border-white/[0.08] rounded-2xl
              w-full max-w-md p-8
              shadow-2xl shadow-black/40
              animate-[fadeIn_0.15s_ease]
            "
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedUser.full_name ?? selectedUser.email}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedUser.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {([
                ["Входов/мес", selectedUser.monthly_logins],
                ["Сред. время (мин)", selectedUser.avg_time_minutes],
                ["Лайки", selectedUser.likes_count],
                ["Сообщения", selectedUser.messages_count],
              ] as [string, number][]).map(([label, val]) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4"
                >
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {val}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-400">Статус:</span>
              <span
                className={`
                  inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${selectedUser.is_active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
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

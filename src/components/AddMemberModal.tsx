import { useState } from "react";
import { addCompanyMember, type CompanyMemberPublic } from "@/data/api/companies.api";
import { getUserByEmail } from "@/data/api/user.api";
import type { UUID } from "@/types.d.ts";
import { Search, UserPlus, X, AlertCircle } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
    companyId: UUID;
    onMemberAdded: (member: CompanyMemberPublic) => void;
};

export const AddMemberModal: React.FC<Props> = ({
    open,
    onClose,
    companyId,
    onMemberAdded,
}) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("member");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foundUser, setFoundUser] = useState<{ id: string; email: string; full_name?: string | null } | null>(null);

    if (!open) return null;

    const handleSearch = async () => {
        if (!email.trim()) {
            setError("Введите email пользователя");
            return;
        }

        try {
            setSearching(true);
            setError(null);
            setFoundUser(null);

            const user = await getUserByEmail(email.trim());
            setFoundUser(user);
        } catch (e: any) {
            if (e?.response?.status === 404) {
                setError("Пользователь с таким email не найден в системе");
            } else {
                setError(e?.response?.data?.detail || "Ошибка при поиске пользователя");
            }
        } finally {
            setSearching(false);
        }
    };

    const handleAdd = async () => {
        if (!foundUser) {
            setError("Сначала найдите пользователя по email");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const member = await addCompanyMember(companyId, {
                user_id: foundUser.id,
                role,
            });

            onMemberAdded(member);
            handleClose();
        } catch (e: any) {
            console.error(e);
            if (e?.response?.status === 409) {
                setError("Этот пользователь уже является участником");
            } else {
                setError(e?.response?.data?.detail || "Не удалось добавить участника");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setRole("member");
        setError(null);
        setFoundUser(null);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* MODAL */}
            <div className="relative bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <UserPlus size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Добавить участника
                            </h2>
                            <p className="text-xs text-gray-500">Найдите зарегистрированного пользователя</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/60 transition">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Email Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email участника
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFoundUser(null);
                                        setError(null);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="user@example.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={searching || !email.trim()}
                                className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                            >
                                <Search size={16} />
                                {searching ? "..." : "Найти"}
                            </button>
                        </div>
                    </div>

                    {/* Found User Card */}
                    {foundUser && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                                {(foundUser.full_name?.[0] ?? foundUser.email[0]).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-sm">
                                    {foundUser.full_name ?? "Пользователь"}
                                </div>
                                <div className="text-xs text-gray-500">{foundUser.email}</div>
                            </div>
                            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                                Найден ✓
                            </div>
                        </div>
                    )}

                    {/* Role Selection */}
                    {foundUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Роль
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                            >
                                <option value="member">Участник</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                            <AlertCircle size={16} className="text-red-500 shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-200 transition font-medium"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={handleAdd}
                        disabled={loading || !foundUser}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition font-medium"
                    >
                        {loading ? "Добавление…" : "Добавить"}
                    </button>
                </div>
            </div>
        </div>
    );
};

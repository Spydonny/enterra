import { useState } from "react";
import { addCompanyMember, type CompanyMemberPublic } from "@/data/api/companies.api";
import { createUser } from "@/data/api/user.api";
import type { UUID } from "@/types.d.ts";

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
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("member");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleAdd = async () => {
        if (!email.trim()) {
            setError("Введите email пользователя");
            return;
        }

        if (!password.trim()) {
            setError("Введите пароль");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // First, create the user
            const newUser = await createUser(email, password, fullName || undefined);

            // Then add them as a company member
            const member = await addCompanyMember(companyId, {
                user_id: newUser.id,
                role,
            });

            onMemberAdded(member);
            setEmail("");
            setPassword("");
            setFullName("");
            setRole("member");
            onClose();
        } catch (e: any) {
            console.error(e);
            setError(e?.response?.data?.detail || "Не удалось добавить участника");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setFullName("");
        setRole("member");
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={handleClose}
            />

            {/* MODAL */}
            <div className="relative bg-white w-full max-w-[480px] rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Добавить участника
                </h2>

                <div className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full border rounded-lg p-2 text-sm"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Пароль <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            className="w-full border rounded-lg p-2 text-sm"
                        />
                    </div>

                    {/* Full Name Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Полное имя (необязательно)
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Иван Иванов"
                            className="w-full border rounded-lg p-2 text-sm"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Роль
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border rounded-lg p-2 text-sm"
                        >
                            <option value="member">Участник</option>
                            <option value="admin">Администратор</option>
                            <option value="developer">Разработчик</option>
                            <option value="designer">Дизайнер</option>
                            <option value="manager">Менеджер</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50"
                    >
                        {loading ? "Добавление…" : "Добавить"}
                    </button>
                </div>
            </div>
        </div>
    );
};

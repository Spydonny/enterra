import { useState } from "react";
import { Star, X } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { score: number; comment?: string }) => Promise<void>;
};

export function RatingModal({ open, onClose, onSubmit }: Props) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSubmit = async () => {
        if (score === 0) return alert("Поставь оценку");

        setLoading(true);
        await onSubmit({ score, comment });
        setLoading(false);

        setScore(0);
        setComment("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500"
                >
                    <X />
                </button>

                <div className="text-lg font-semibold mb-4">
                    Оставить отзыв
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            size={28}
                            className={`cursor-pointer ${(hover || score) >= i
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setScore(i)}
                        />
                    ))}
                </div>

                {/* Comment */}
                <textarea
                    className="w-full border rounded-lg p-3 text-sm resize-none"
                    rows={4}
                    placeholder="Комментарий (необязательно)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                    {loading ? "Отправка..." : "Отправить"}
                </button>
            </div>
        </div>
    );
}

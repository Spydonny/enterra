import { useState } from "react";
import { postsApi, type Post } from "@/data/api/feed.api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (post: Post) => void;
};

export const CreatePostModal: React.FC<Props> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      const post = await postsApi.createPost({ content });
      onCreated(post);
      setContent("");
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-[520px] rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Создать пост
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Что нового?"
          className="w-full border rounded-lg p-3 text-sm resize-none"
          rows={4}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            Отмена
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-black text-white text-sm disabled:opacity-50"
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { postsApi, type Post } from "@/data/api/feed.api";
import { uploadFile, type FileMeta } from "@/data/api/files.api";

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageMeta, setImageMeta] = useState<FileMeta | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!open) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const uploaded = await uploadFile(file);
      setImageMeta(uploaded);
    } catch (err) {
      setUploadError("Не удалось загрузить изображение");
      console.error(err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageMeta(null);
    setUploadError(null);
  };

  const handleCreate = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      const post = await postsApi.createPost({
        content,
        media_urls: imageMeta?.path || null,
      });
      onCreated(post);
      setContent("");
      setImageMeta(null);
      setUploadError(null);
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

        {/* Image Upload Section */}
        <div className="mt-4 space-y-2">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
              disabled={isUploadingImage}
            />
          </label>

          {isUploadingImage && (
            <p className="text-sm text-gray-500">
              Загрузка изображения…
            </p>
          )}

          {uploadError && (
            <p className="text-sm text-red-500">
              {uploadError}
            </p>
          )}

          {/* Image Preview */}
          {imageMeta && (
            <div className="relative inline-block mt-2">
              <img
                src={imageMeta.path}
                alt="Превью"
                className="max-h-48 rounded-lg border object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80"
                type="button"
              >
                ×
              </button>
              <p className="text-xs text-gray-500 mt-1">
                {imageMeta.filename}
              </p>
            </div>
          )}
        </div>

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

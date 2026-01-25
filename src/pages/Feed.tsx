import type { Post } from "../types";
import { formatPostTime } from "../utils/date";
import { useEffect, useState } from "react";
import { postsApi } from "@/data/api/feed.api";
import { getUserById } from "@/data/api/user.api";
import { getCompany } from "@/data/api/companies.api";
import { type CompanyBase } from "@/data/api/companies.api";
import { PostCardSkeleton } from "@/components/Skeleton";


export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  // 🔹 ДОБАВЛЕНО: состояния
  const [authorName, setAuthorName] = useState<string>(
    `User ${post.author_id.slice(0, 6)}`
  );
  const [company, setCompany] = useState<CompanyBase | null>(null);

  // 🔹 ДОБАВЛЕНО: подгрузка реальных данных
  useEffect(() => {
    getUserById(post.author_id)
      .then((user) => {
        setAuthorName(user.full_name ?? user.email);
      })
      .catch(() => { });

    if (post.company_id) {
      getCompany(post.company_id)
        .then((company) => {
          setCompany(company);
        })
        .catch(() => { });
    }

    console.log(post.company_id);

  }, [post.author_id, post.company_id]);

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6
                 max-w-[680px] mx-auto w-full"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {company?.logo_url && (
            <img
              src={company.logo_url}
              alt="Логотип компании"
              className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white shadow-md"
            />
          )}

          <div>
            <div className="flex items-center gap-2">
              {/* 🔹 ИМЯ ПОЛЬЗОВАТЕЛЯ — БЕЗ ИЗМЕНЕНИЯ UI */}
              <span className="font-semibold text-[15px] text-gray-900">
                {authorName}
              </span>

              {/* 🔹 КОМПАНИЯ — ТОЛЬКО ТЕКСТ ЗАМЕНЁН */}
              {post.company_id && company?.name && (
                <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md">
                  {company.name}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-0.5">
              {formatPostTime(post.created_at)}
            </div>
          </div>
        </div>

        <button className="text-gray-500 hover:text-gray-700 text-xl leading-none">
          ⋯
        </button>
      </div>

      {/* TEXT */}
      <div className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800">
        {post.content}
      </div>

      {/* IMAGE */}
      {post.media_urls && (
        <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={post.media_urls}
            alt="post"
            className="w-full object-cover"
          />
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-6 text-gray-600 text-sm">
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          ❤ <span>{post.reactions_count}</span>
        </button>

        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          💬 <span>{post.comments_count}</span>
        </button>

        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          ↻ <span>0</span>
        </button>
      </div>
    </div>
  );
};


// 🔹 MAIN FEED PAGE
export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await postsApi.getPosts({
          skip: 0,
          limit: 50,
        });
        setPosts(res.data);
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="p-10 bg-[#f7f7f5] min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900">
            Лента новостей
          </h1>
        </div>
        <div className="mt-10 space-y-6">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#f7f7f5] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">
          Лента новостей
        </h1>

        <div className="flex items-center gap-3">
          <input
            placeholder="Поиск в ленте..."
            className="border border-gray-300/70 rounded-xl px-4 py-2 w-60 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500/30 transition"
          />

          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition">
            Глобальный поиск
          </button>
        </div>
      </div>

      {/* POSTS */}
      <div className="mt-10 space-y-6">
        {posts.length === 0 ? (
          <div className="text-gray-500 text-sm">
            Пока нет постов
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};


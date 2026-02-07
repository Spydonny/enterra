import type { Post } from "../types";
import { formatPostTime } from "../utils/date";
import { useEffect, useState } from "react";

import { postsApi } from "@/data/api/feed.api";
import { getUserById } from "@/data/api/user.api";
import { getCompany, type CompanyBase } from "@/data/api/companies.api";

import { PostCardSkeleton } from "@/components/Skeleton";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { likesStorage } from "@/utils/likesStorage";

/* ======================================================
   POST CARD
====================================================== */

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [authorName, setAuthorName] = useState(
    `User ${post.author_id.slice(0, 6)}`
  );

  const [company, setCompany] = useState<CompanyBase | null>(null);

  const [likes, setLikes] = useState(post.reactions_count);
  const [liked, setLiked] = useState(likesStorage.has(post.id));

  /* =============================
     LOAD USER + COMPANY
  ============================== */

  useEffect(() => {
    getUserById(post.author_id)
      .then((u) => setAuthorName(u.full_name ?? u.email))
      .catch(() => { });

    if (post.company_id) {
      getCompany(post.company_id)
        .then(setCompany)
        .catch(() => { });
    }
  }, [post.author_id, post.company_id]);

  /* =============================
     SYNC COUNTS (если список обновился)
  ============================== */

  useEffect(() => {
    setLikes(post.reactions_count);
  }, [post.reactions_count]);

  /* =============================
     REGISTER VIEW (1 раз)
  ============================== */

  useEffect(() => {
    postsApi.registerView(post.id).catch(() => { });
  }, [post.id]);

  /* =============================
     ❤️ LIKE TOGGLE
  ============================== */

  const handleLike = async () => {
    const next = !liked;

    setLiked(next);
    setLikes((p) => (next ? p + 1 : p - 1));

    next ? likesStorage.add(post.id) : likesStorage.remove(post.id);

    try {
      await postsApi.toggleLike(post.id);
    } catch {
      // rollback
      setLiked(!next);
      setLikes((p) => (next ? p - 1 : p + 1));
    }
  };

  /* =============================
     UI
  ============================== */

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-[680px] mx-auto w-full">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {company?.logo_url && (
            <img
              src={company.logo_url}
              className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white shadow-md"
            />
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-gray-900">
                {authorName}
              </span>

              {company?.name && (
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
      </div>

      {/* TEXT */}
      <div className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800">
        {post.content}
      </div>

      {/* IMAGE */}
      {post.media_urls && (
        <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
          <img src={post.media_urls} className="w-full object-cover" />
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-8 text-sm">
        {/* LIKE */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-medium transition
            ${liked
              ? "text-red-500 scale-105"
              : "text-gray-600 hover:text-red-500"
            }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {likes}
        </button>

        {/* COMMENTS */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <MessageCircle size={18} />
          {post.comments_count}
        </button>

        {/* REPOST */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
          <Repeat2 size={18} />
          0
        </button>
      </div>
    </div>
  );
};

/* ======================================================
   FEED PAGE
====================================================== */

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const res = await postsApi.getPosts({ skip: 0, limit: 50 });
      setPosts(res.data);
    } catch (e) {
      console.error("Failed to load posts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  /* =============================
     UI
  ============================== */

  return (
    <div className="p-10 bg-[#f7f7f5] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">
          Лента новостей
        </h1>

        <div className="flex items-center gap-3">
          <input
            placeholder="Поиск в ленте..."
            className="border border-gray-300/70 rounded-xl px-4 py-2 w-60 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/30 transition"
          />

          <button className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Глобальный поиск
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-6">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      {/* POSTS */}
      {!loading && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-gray-500 text-sm">Пока нет постов</div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}
    </div>
  );
};

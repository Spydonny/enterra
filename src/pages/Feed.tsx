import React, { useState } from "react";
import type { Post } from "../types";

// 🔹 COMPONENT: PostCard
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-gray-900">
                {post.author}
              </span>
              {post.role && (
                <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md">
                  {post.role}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{post.time}</div>
          </div>
        </div>

        {/* Menu */}
        <button className="text-gray-500 hover:text-gray-700 text-xl leading-none">⋯</button>
      </div>

      {/* TEXT */}
      <div className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800">
        {post.text}
      </div>

      {/* IMAGE */}
      {post.image && (
        <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
          <img src={post.image} alt="post" className="w-full" />
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-6 text-gray-600 text-sm">
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          ❤ <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          💬 <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          ↻ <span>{ 0}</span>
        </button>
      </div>
    </div>
  );
};

// 🔹 MAIN FEED PAGE
export const Feed: React.FC<{ posts: Post[]; onCreate: (t: string) => void }> = ({ posts, onCreate }) => {
  const [text, setText] = useState("");

  return (
    <div className="p-10 bg-[#f7f7f5] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">Лента новостей</h1>

        <div className="flex items-center gap-3">
          <input
            placeholder="Поиск в ленте..."
            className="border border-gray-300/70 rounded-xl px-4 py-2 w-60 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500/30 transition"
          />

          <button
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md hover:shadow-lg hover:brightness-105 transition"
          >
            Глобальный поиск
          </button>
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { postsApi, type Post } from "@/data/api/feed.api";
import { PostCard } from "@/pages/Feed";
import { CreatePostModal } from "@/components/CreatePostModal";
import type { CompanyPublic } from "@/data/api/companies.api";

export const ProfilePost: React.FC<{ company: CompanyPublic, isYourCompany: boolean }> = ({ company, isYourCompany }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadPosts = async () => {
    try {
      const res = await postsApi.getCompanyPosts(company.id, { limit: 20 });
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      {isYourCompany && (
        <div className="flex justify-end max-w-[680px] mx-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm"
          >
            Создать пост
          </button>
        </div>
      )}

      {/* POSTS */}
      <div className="space-y-4">
        {posts.length ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Постов пока нет
          </p>
        )}
      </div>

      {/* MODAL */}
      <CreatePostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(post) =>
          setPosts((prev) => [post, ...prev])
        }
      />
    </div>
  );
};

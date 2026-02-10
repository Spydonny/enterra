import React, { useEffect, useState, useRef } from "react";
import {
    Heart,
    MessageCircle,
    Repeat2,
    Send,
    ArrowLeft,
    Share2,
    Copy,
    Link2,
    X,
    Check,
} from "lucide-react";

import { postsApi, type Comment } from "@/data/api/feed.api";
import type { Post } from "../types";
import { getUserById } from "@/data/api/user.api";
import { getCompany, type CompanyBase } from "@/data/api/companies.api";
import { formatPostTime } from "../utils/date";
import { likesStorage } from "@/utils/likesStorage";
import { PostCardSkeleton, Skeleton } from "@/components/Skeleton";

/* ======================================================
   SHARE MODAL
====================================================== */

const ShareModal: React.FC<{
    postId: string;
    onClose: () => void;
}> = ({ postId, onClose }) => {
    const [copied, setCopied] = useState(false);
    const postUrl = `${window.location.origin}/post/${postId}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const input = document.createElement("input");
            input.value = postUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareOptions = [
        {
            label: "Скопировать ссылку",
            icon: copied ? <Check size={18} /> : <Copy size={18} />,
            color: copied ? "text-green-600" : "text-gray-700",
            onClick: handleCopyLink,
        },
        {
            label: "Telegram",
            icon: (
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            ),
            color: "text-[#0088cc]",
            onClick: () =>
                window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(postUrl)}`,
                    "_blank"
                ),
        },
        {
            label: "WhatsApp",
            icon: (
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            color: "text-[#25D366]",
            onClick: () =>
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(postUrl)}`,
                    "_blank"
                ),
        },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-[380px] overflow-hidden animate-[scaleIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Share2 size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-900">Поделиться</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition"
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {/* Link preview */}
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link2 size={14} />
                        <span className="truncate">{postUrl}</span>
                    </div>
                </div>

                {/* Options */}
                <div className="p-3">
                    {shareOptions.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={opt.onClick}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-left"
                        >
                            <span className={opt.color}>{opt.icon}</span>
                            <span className="text-[15px] text-gray-800 font-medium">
                                {opt.label}
                            </span>
                            {opt.label === "Скопировать ссылку" && copied && (
                                <span className="ml-auto text-xs text-green-600 font-medium">
                                    Скопировано!
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ======================================================
   COMMENT ITEM
====================================================== */

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    const [authorName, setAuthorName] = useState(
        `User ${comment.author_id.slice(0, 6)}`
    );

    useEffect(() => {
        getUserById(comment.author_id)
            .then((u) => setAuthorName(u.full_name ?? u.email))
            .catch(() => { });
    }, [comment.author_id]);

    return (
        <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
            {/* Avatar placeholder */}
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {authorName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                        {authorName}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatPostTime(comment.created_at)}
                    </span>
                </div>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                </p>
            </div>
        </div>
    );
};

/* ======================================================
   COMMENT SKELETON
====================================================== */

const CommentSkeleton: React.FC = () => (
    <div className="flex gap-3 py-4 border-b border-gray-100">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex-1">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-4/6" />
        </div>
    </div>
);

/* ======================================================
   POST PAGE
====================================================== */

type PostPageProps = {
    postId: string;
    onBack: () => void;
};

export const PostPage: React.FC<PostPageProps> = ({ postId, onBack }) => {
    const [post, setPost] = useState<Post | null>(null);
    const [loadingPost, setLoadingPost] = useState(true);

    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);

    const [authorName, setAuthorName] = useState("");
    const [company, setCompany] = useState<CompanyBase | null>(null);

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [showShare, setShowShare] = useState(false);

    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    /* =============================
       LOAD POST
    ============================== */

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const p = await postsApi.getPostById(postId);
                if (cancelled) return;

                setPost(p);
                setLikes(p.reactions_count);
                setLiked(likesStorage.has(p.id));

                // author
                getUserById(p.author_id)
                    .then((u) => !cancelled && setAuthorName(u.full_name ?? u.email))
                    .catch(() => { });

                // company
                if (p.company_id) {
                    getCompany(p.company_id)
                        .then((c) => !cancelled && setCompany(c))
                        .catch(() => { });
                }

                // register view
                postsApi.registerView(p.id).catch(() => { });
            } catch (err) {
                console.error("Failed to load post", err);
            } finally {
                if (!cancelled) setLoadingPost(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [postId]);

    /* =============================
       LOAD COMMENTS
    ============================== */

    const loadComments = async () => {
        setLoadingComments(true);
        try {
            const res = await postsApi.getComments(postId, { skip: 0, limit: 100 });
            setComments(res.data);
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    /* =============================
       ❤️ LIKE TOGGLE
    ============================== */

    const handleLike = async () => {
        if (!post) return;
        const next = !liked;

        setLiked(next);
        setLikes((p) => (next ? p + 1 : p - 1));
        next ? likesStorage.add(post.id) : likesStorage.remove(post.id);

        try {
            await postsApi.toggleLike(post.id);
        } catch {
            setLiked(!next);
            setLikes((p) => (next ? p - 1 : p + 1));
        }
    };

    /* =============================
       💬 SUBMIT COMMENT
    ============================== */

    const handleSubmitComment = async () => {
        const trimmed = commentText.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);
        try {
            const newComment = await postsApi.createComment(postId, {
                content: trimmed,
            });
            setComments((prev) => [...prev, newComment]);
            setCommentText("");

            // update post comment count locally
            setPost((prev) =>
                prev ? { ...prev, comments_count: prev.comments_count + 1 } : prev
            );
        } catch (err) {
            console.error("Failed to submit comment", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    /* =============================
       LOADING STATE
    ============================== */

    if (loadingPost) {
        return (
            <div className="p-10 bg-[#f7f7f5] min-h-screen">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Назад</span>
                </button>
                <PostCardSkeleton />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-10 bg-[#f7f7f5] min-h-screen">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Назад</span>
                </button>
                <div className="text-center py-20 text-gray-500">
                    Пост не найден
                </div>
            </div>
        );
    }

    /* =============================
       UI
    ============================== */

    return (
        <div className="p-10 bg-[#f7f7f5] min-h-screen">
            {/* BACK BUTTON */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
            >
                <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-0.5 transition-transform"
                />
                <span className="text-sm font-medium">Назад к ленте</span>
            </button>

            {/* POST CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-[680px] mx-auto w-full">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {company?.logo_url && (
                            <img
                                src={company.logo_url}
                                className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white shadow-md"
                            />
                        )}

                        {!company?.logo_url && (
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-md">
                                {authorName.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[15px] text-gray-900">
                                    {authorName || `User ${post.author_id.slice(0, 6)}`}
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

                {/* Content */}
                <div className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800">
                    {post.content}
                </div>

                {/* Image */}
                {post.media_urls && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                        <img src={post.media_urls} className="w-full object-cover" />
                    </div>
                )}

                {/* Footer actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-8 text-sm">
                    {/* Like */}
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

                    {/* Comments */}
                    <button
                        onClick={() => commentInputRef.current?.focus()}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                    >
                        <MessageCircle size={18} />
                        {post.comments_count}
                    </button>

                    {/* Repost / Share */}
                    <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
                    >
                        <Repeat2 size={18} />
                        Поделиться
                    </button>
                </div>
            </div>

            {/* ========================================
         COMMENTS SECTION
      ======================================== */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-[680px] mx-auto w-full mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Комментарии
                    {!loadingComments && (
                        <span className="ml-2 text-sm font-normal text-gray-400">
                            ({comments.length})
                        </span>
                    )}
                </h2>

                {/* Comment input */}
                <div className="flex gap-3 mb-6">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        Я
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            ref={commentInputRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Написать комментарий..."
                            rows={2}
                            className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim() || submitting}
                            className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>

                {/* Comments list */}
                {loadingComments && (
                    <div>
                        <CommentSkeleton />
                        <CommentSkeleton />
                        <CommentSkeleton />
                    </div>
                )}

                {!loadingComments && comments.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        Пока нет комментариев. Будьте первым!
                    </div>
                )}

                {!loadingComments &&
                    comments.map((c) => <CommentItem key={c.id} comment={c} />)}
            </div>

            {/* Share modal */}
            {showShare && (
                <ShareModal postId={post.id} onClose={() => setShowShare(false)} />
            )}
        </div>
    );
};

import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
            style={{
                animation: "shimmer 1.5s ease-in-out infinite",
            }}
        />
    );
};

export const PostCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-[680px] mx-auto w-full">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="mt-4">
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
            <div className="mt-4 flex items-center gap-6">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
    );
};

export const CompanyCardSkeleton: React.FC = () => {
    return (
        <div className="w-[360px] h-[220px] bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    );
};

export const ChatListSkeleton: React.FC = () => {
    return (
        <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4">
                    <div className="flex justify-between">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const MessagesSkeleton: React.FC = () => {
    return (
        <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className={`max-w-[65%] ${i % 2 === 0 ? "ml-auto" : ""}`}
                >
                    <Skeleton className={`h-20 rounded-2xl ${i % 2 === 0 ? "w-64" : "w-80"}`} />
                </div>
            ))}
        </div>
    );
};

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { FeedHeader } from "@/components/feed/feed-header";
import { CreatePostForm } from "@/components/feed/create-post-form";
import { PostCard } from "@/components/feed/post-card";
import { PostCardSkeleton } from "@/components/feed/post-card-skeleton";
import { FeedFooter } from "@/components/feed/feed-footer";
import { usePosts } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts(debouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (isError) toast.error("Erro ao carregar posts. Tente novamente.");
  }, [isError]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <FeedHeader
        search={search}
        onSearchChange={setSearch}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <CreatePostForm isAuthenticated={isAuthenticated} />

        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="flex justify-center py-8">
            <span className="text-text-secondary-dark text-sm">
              Nenhum post encontrado.
            </span>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUser?.id ?? null}
            isAuthenticated={isAuthenticated}
          />
        ))}

        <div ref={bottomRef} className="flex flex-col gap-4">
          {isFetchingNextPage && Array.from({ length: 2 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </main>
      <FeedFooter />
    </div>
  );
}

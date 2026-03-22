"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Pencil, Trash2, X, Check } from "lucide-react";
import { Post } from "@/types";
import { useLikePost } from "@/hooks/useLikePost";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { useLikedPostsStore } from "@/store/likedPostsStore";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: Post;
  currentUserId: number | null;
  isAuthenticated: boolean;
}

export function PostCard({
  post,
  currentUserId,
  isAuthenticated,
}: PostCardProps) {
  const router = useRouter();
  const { mutate: toggleLike } = useLikePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const isLiked = useLikedPostsStore((state) => state.isLiked);
  const setLikedInStore = useLikedPostsStore((state) => state.setLiked);

  const [liked, setLiked] = useState(() => isLiked(post.id));
  const [count, setCount] = useState(post.likesCount);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  const isOwner = currentUserId === post.authorId;
  const handle = post.authorName.toLowerCase().replace(/\s+/g, "");
  const date = new Date(post.createdAt).toLocaleDateString("pt-BR");

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    toggleLike(post.id, {
      onSuccess: (data) => {
        setLiked(data.liked);
        setCount((prev) => (data.liked ? prev + 1 : Math.max(0, prev - 1)));
        if (currentUserId) setLikedInStore(post.id, data.liked, currentUserId);
      },
    });
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleSaveEdit = () => {
    updatePost(
      { id: post.id, data: { title: editTitle, content: editContent } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  const cardClass =
    "bg-white dark:bg-secondary-blue border border-gray-200 dark:border-text-secondary-dark/20 rounded-xl p-4";

  if (isEditing) {
    return (
      <div className={cardClass}>
        <input
          data-testid="edit-title-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-lg font-bold text-secondary-blue dark:text-primary-white placeholder:text-primary-gray dark:placeholder:text-text-secondary-dark mb-2"
          placeholder="Título"
        />
        <div className="border-t border-gray-200 dark:border-text-secondary-dark/20 my-3" />
        <textarea
          data-testid="edit-content-input"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={3}
          className="w-full bg-transparent border-none outline-none resize-none text-primary-gray dark:text-text-secondary-dark placeholder:text-primary-gray/60 dark:placeholder:text-text-secondary-dark/60"
          placeholder="Conteúdo"
        />
        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelEdit}
            className="text-primary-gray dark:text-text-secondary-dark hover:text-secondary-blue dark:hover:text-primary-white"
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={handleSaveEdit}
            className="bg-primary-blue text-primary-white rounded-full hover:bg-primary-blue/90 disabled:opacity-60"
          >
            <Check className="h-4 w-4 mr-1" />
            {isUpdating ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <span className="font-bold text-secondary-blue dark:text-primary-white">
            {post.authorName}
          </span>
          <span className="text-sm text-primary-gray dark:text-text-secondary-dark">
            @{handle} · {date}
          </span>
        </div>
        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-full text-primary-gray dark:text-text-secondary-dark hover:text-secondary-blue dark:hover:text-primary-white transition-colors"
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full text-primary-gray dark:text-text-secondary-dark hover:text-primary-red transition-colors"
              title="Deletar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <p className="font-bold text-secondary-blue dark:text-primary-white mb-1">
        {post.title}
      </p>
      <p className="text-primary-gray dark:text-text-secondary-dark text-sm">
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="rounded-lg max-h-72 object-cover w-full mt-3"
        />
      )}

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-sm transition-colors"
          title={liked ? "Descurtir" : "Curtir"}
        >
          <Heart
            className={`h-5 w-5 cursor-pointer ${
              liked ? "fill-primary-red text-primary-red" : "text-primary-red"
            }`}
          />
          <span className="text-primary-gray dark:text-text-secondary-dark">
            {count}
          </span>
        </button>
      </div>
    </div>
  );
}

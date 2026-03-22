"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import { postSchema, PostFormData } from "@/schemas/postSchema";
import { useCreatePost } from "@/hooks/useCreatePost";
import { Button } from "@/components/ui/button";

interface CreatePostFormProps {
  isAuthenticated: boolean;
}

export function CreatePostForm({ isAuthenticated }: CreatePostFormProps) {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreatePost();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setImageError("A imagem deve ter no máximo 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);
      setValue("image", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageError(null);
    setValue("image", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: PostFormData) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    createPost(data, {
      onSuccess: () => {
        reset();
        setImagePreview(null);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handlePostClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-blue border border-gray-200 dark:border-text-secondary-dark/20 rounded-xl p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("title")}
          placeholder="Título"
          className="w-full bg-transparent border-none outline-none text-base font-semibold text-secondary-blue dark:text-primary-white placeholder:text-primary-gray dark:placeholder:text-text-secondary-dark/60 mb-2"
        />
        {errors.title && (
          <p className="text-xs text-primary-red mb-1">
            {errors.title.message}
          </p>
        )}

        <textarea
          {...register("content")}
          placeholder="E aí, o que está rolando?"
          rows={3}
          className="w-full bg-transparent border-none outline-none resize-none min-h-20 text-secondary-blue dark:text-text-secondary-dark placeholder:text-primary-gray dark:placeholder:text-text-secondary-dark/60"
        />
        {errors.content && (
          <p className="text-xs text-primary-red mt-1">
            {errors.content.message}
          </p>
        )}

        <div className="border-t border-gray-200 dark:border-text-secondary-dark/20 my-3" />

        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg max-h-40 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-secondary-blue/80 rounded-full p-1 text-primary-white hover:bg-primary-red transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {imageError && (
          <p className="text-xs text-primary-red mt-2">{imageError}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 cursor-pointer rounded-full text-text-secondary-dark hover:text-primary-blue transition-colors"
              title="Adicionar imagem"
            >
              <ImageIcon className="size-8 text-primary-blue" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            onClick={!isAuthenticated ? handlePostClick : undefined}
            className="bg-primary-blue cursor-pointer text-primary-white rounded-full px-6 hover:bg-primary-blue/90 disabled:opacity-60"
          >
            {isPending ? "Postando..." : "Postar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/post.service";

interface CreatePostPayload {
  title: string;
  content: string;
  image?: string;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostPayload) => postService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

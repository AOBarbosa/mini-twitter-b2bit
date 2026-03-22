import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/post.service";

interface UpdatePostPayload {
  id: number;
  data: {
    title: string;
    content: string;
    image?: string;
  };
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePostPayload) => postService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

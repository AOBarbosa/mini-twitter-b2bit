import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/post.service";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postService.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

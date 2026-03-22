import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postService } from "@/services/post.service";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postService.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Erro ao curtir post. Tente novamente.");
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
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
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error("Você não tem permissão para editar este post.");
      } else {
        toast.error("Erro ao editar post. Tente novamente.");
      }
    },
  });
}

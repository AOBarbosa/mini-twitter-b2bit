import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useLikedPostsStore } from "@/store/likedPostsStore";

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearLikes = useLikedPostsStore((state) => state.clear);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      clearLikes();
    },
  });
}

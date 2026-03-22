import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { LoginFormData } from "@/schemas/loginSchema";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(user, token);
      router.push("/feed");
    },
    onError: () => {
      toast.error("E-mail ou senha inválidos.");
    },
  });
}

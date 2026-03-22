import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { RegisterFormData } from "@/schemas/registerSchema";
import { useAuthStore } from "@/store/authStore";

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: async (_, variables) => {
      const { token, user } = await authService.login({
        email: variables.email,
        password: variables.password,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(user, token);
      router.push("/feed");
    },
    onError: () => {
      toast.error("E-mail já cadastrado ou dados inválidos.");
    },
  });
}

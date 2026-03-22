import { api } from "@/lib/axios";
import { LoginFormData } from "@/schemas/loginSchema";
import { RegisterFormData } from "@/schemas/registerSchema";
import { LoginResponse, RegisterResponse } from "@/types";

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

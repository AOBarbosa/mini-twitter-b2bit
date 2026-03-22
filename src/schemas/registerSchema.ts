import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, { error: "Nome deve ter no mínimo 2 caracteres" }),
  email: z.email({ error: "E-mail inválido" }),
  password: z.string().min(4, { error: "Senha deve ter no mínimo 4 caracteres" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

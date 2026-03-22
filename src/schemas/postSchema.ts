import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, { error: "Título deve ter no mínimo 3 caracteres" }),
  content: z.string().min(1, { error: "Conteúdo não pode ser vazio" }),
  image: z.string().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

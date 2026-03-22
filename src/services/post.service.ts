import { api } from "@/lib/axios";
import { Post, PostsResponse } from "@/types";

interface PostPayload {
  title: string;
  content: string;
  image?: string;
}

export const postService = {
  getAll: async (page: number, search?: string): Promise<PostsResponse> => {
    const params: Record<string, string> = { page: String(page), limit: "10" };
    if (search) params.search = search;
    const response = await api.get<PostsResponse>("/posts", { params });
    return response.data;
  },

  create: async (data: PostPayload): Promise<Post> => {
    const response = await api.post<Post>("/posts", data);
    return response.data;
  },

  update: async (id: number, data: PostPayload): Promise<{ success: true }> => {
    const response = await api.put<{ success: true }>(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ success: true }> => {
    const response = await api.delete<{ success: true }>(`/posts/${id}`);
    return response.data;
  },

  toggleLike: async (id: number): Promise<{ liked: boolean }> => {
    const response = await api.post<{ liked: boolean }>(`/posts/${id}/like`);
    return response.data;
  },
};

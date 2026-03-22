export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
  likesCount: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

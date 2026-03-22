import { create } from "zustand";

interface LikedPostsState {
  likedIds: Set<number>;
  hydrate: (userId: number) => void;
  setLiked: (postId: number, liked: boolean, userId: number) => void;
  isLiked: (postId: number) => boolean;
  clear: () => void;
}

function storageKey(userId: number) {
  return `liked_posts_${userId}`;
}

export const useLikedPostsStore = create<LikedPostsState>((set, get) => ({
  likedIds: new Set(),

  hydrate: (userId) => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      const ids: number[] = raw ? JSON.parse(raw) : [];
      set({ likedIds: new Set(ids) });
    } catch {
      // localStorage unavailable — keep initial state
    }
  },

  setLiked: (postId, liked, userId) => {
    const likedIds = new Set(get().likedIds);
    if (liked) {
      likedIds.add(postId);
    } else {
      likedIds.delete(postId);
    }
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify([...likedIds]));
    } catch {
      // ignore
    }
    set({ likedIds });
  },

  isLiked: (postId) => get().likedIds.has(postId),

  clear: () => set({ likedIds: new Set() }),
}));

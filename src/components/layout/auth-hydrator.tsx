"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useLikedPostsStore } from "@/store/likedPostsStore";

export function AuthHydrator() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const hydrateLikes = useLikedPostsStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user) hydrateLikes(user.id);
  }, [user, hydrateLikes]);

  return null;
}

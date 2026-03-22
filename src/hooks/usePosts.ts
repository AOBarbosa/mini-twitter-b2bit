import { useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services/post.service";

export function usePosts(search: string) {
  return useInfiniteQuery({
    queryKey: ["posts", search],
    queryFn: ({ pageParam }) => postService.getAll(pageParam, search || undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });
}

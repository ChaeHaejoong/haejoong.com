import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPostById } from "@/entities/post/api/fetchPostById";
import type { PostResponseDto } from "@haejoong.com/shared";
import { togglePostLike } from "@/entities/post/api/togglePostLike";

export function usePost(postId: string) {
  return useQuery<PostResponseDto>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
    refetchOnMount: false, // loader가 캐시를 채우므로 마운트 시 refetch 방지
  });
}

export function useTogglePostLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: (response) => {
      queryClient.setQueryData<PostResponseDto | undefined>(
        ["post", postId],
        (previous: PostResponseDto | undefined) =>
          previous
            ? {
                ...previous,
                isLiked: response.liked,
                likes: response.likes,
              }
            : previous,
      );

      queryClient.setQueriesData<PostResponseDto[]>(
        { queryKey: ["posts"] },
        (previous: PostResponseDto[] | undefined) =>
          previous?.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: response.liked,
                  likes: response.likes,
                }
              : post,
          ) ?? previous,
      );
    },
  });
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { MyCommentsPageResponseDto } from "@haejoong.com/shared";
import { fetchMyComments } from "@/entities/user/api/fetchMyComments";

export function useMyComments(page: number, pageSize = 8) {
  return useQuery<MyCommentsPageResponseDto>({
    queryKey: ["my-comments", page, pageSize],
    queryFn: () => fetchMyComments(page, pageSize),
    placeholderData: keepPreviousData,
  });
}

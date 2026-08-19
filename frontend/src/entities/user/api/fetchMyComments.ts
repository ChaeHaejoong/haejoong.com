import { api } from "@/shared/api";
import type { MyCommentsPageResponseDto } from "@haejoong.com/shared";

export async function fetchMyComments(
  page: number,
  pageSize: number,
): Promise<MyCommentsPageResponseDto> {
  const { data } = await api.get("/users/me/comments", {
    params: { page, pageSize },
  });
  return data;
}

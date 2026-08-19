import { api } from "@/shared/api";
import type { PostResponseDto } from "@haejoong.com/shared";

export async function fetchPostById(id: string): Promise<PostResponseDto> {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}

import { api } from "@/shared/api";
import type { PostResponseDto } from "@haejoong.com/shared";

export async function fetchPosts(): Promise<PostResponseDto[]> {
  const response = await api.get("/posts/published");
  return response.data;
}

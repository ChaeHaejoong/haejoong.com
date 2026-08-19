import { api } from "@/shared/api";

export async function togglePostLike(
  postId: string,
): Promise<{ liked: boolean; likes: number }> {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
}

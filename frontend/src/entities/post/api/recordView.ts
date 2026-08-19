import { api } from "@/shared/api";

export async function recordView(postId: string): Promise<void> {
  await api.post(`/posts/${postId}/view`);
}

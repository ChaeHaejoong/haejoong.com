import { api } from "@/shared/api";

export async function deleteTag(id: string): Promise<void> {
  await api.delete(`/tags/${id}`);
}

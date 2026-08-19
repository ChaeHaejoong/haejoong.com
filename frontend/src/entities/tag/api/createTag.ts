import { api } from "@/shared/api";
import type { TagDto } from "@haejoong.com/shared";

export async function createTag(name: string): Promise<TagDto> {
  const { data } = await api.post("/tags", { name });
  return data;
}

import { api } from "@/shared/api";
import type { TagDto } from "@haejoong.com/shared";

export async function fetchTags(): Promise<TagDto[]> {
  const { data } = await api.get("/tags");
  return data;
}

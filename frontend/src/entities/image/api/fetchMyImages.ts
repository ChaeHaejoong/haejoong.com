import { api } from "@/shared/api";
import type { ImageSummaryDto } from "@haejoong.com/shared";

export async function fetchMyImages(): Promise<ImageSummaryDto[]> {
  const { data } = await api.get("/images/mine");
  return data;
}

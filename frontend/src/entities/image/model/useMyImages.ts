import { useQuery } from "@tanstack/react-query";
import type { ImageSummaryDto } from "@haejoong.com/shared";
import { fetchMyImages } from "@/entities/image/api/fetchMyImages";

export function useMyImages() {
  return useQuery<ImageSummaryDto[]>({
    queryKey: ["my-images"],
    queryFn: fetchMyImages,
  });
}

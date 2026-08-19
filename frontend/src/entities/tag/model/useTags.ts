import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/entities/tag/api/fetchTags";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });
}

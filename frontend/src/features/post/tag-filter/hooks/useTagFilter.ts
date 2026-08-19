import { useMemo, useState } from "react";
import type { PostResponseDto } from "@haejoong.com/shared";
import { useTags } from "@/entities/tag/model/useTags";

export function useTagFilter(posts: PostResponseDto[]) {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const { data: allTags = [] } = useTags();

  const filteredPosts = useMemo(
    () =>
      selectedTagId
        ? posts.filter((p) => p.tags?.some((t) => t.id === selectedTagId))
        : posts,
    [posts, selectedTagId],
  );

  return { selectedTagId, setSelectedTagId, allTags, filteredPosts };
}

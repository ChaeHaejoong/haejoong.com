import PostList from "@/widgets/post/PostList";
// import PostListHeader from "@/widgets/post/PostListHeader";
import TagFilterBar from "@/features/post/tag-filter/ui/TagFilterBar";
import type { HomeLoaderData } from "./loader";
import { useLoaderData } from "react-router-dom";
import { useTagFilter } from "@/features/post/tag-filter/hooks/useTagFilter";

export default function HomePage() {
  const posts = useLoaderData() as HomeLoaderData;
  const { selectedTagId, setSelectedTagId, allTags, filteredPosts } =
    useTagFilter(posts);

  return (
    <>
      {/* <PostListHeader /> */}
      <TagFilterBar
        tags={allTags}
        selectedTagId={selectedTagId}
        onSelect={setSelectedTagId}
      />
      <PostList posts={filteredPosts} emptyMessage="아직 게시글이 없어요" />
    </>
  );
}

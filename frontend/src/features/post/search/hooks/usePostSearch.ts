import { useDeferredValue, useState } from "react";
import type { PostResponseDto } from "@haejoong.com/shared";

export function usePostSearch(posts: PostResponseDto[]) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const deferredKeyword = useDeferredValue(searchKeyword);
  const normalizedKeyword = deferredKeyword.trim().toLowerCase();

  const filteredPosts = !normalizedKeyword
    ? posts
    : posts.filter((post) => {
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();
        return title.includes(normalizedKeyword) || content.includes(normalizedKeyword);
      });

  const emptyMessage = normalizedKeyword
    ? `"${searchKeyword}"에 해당하는 게시글이 없어요`
    : "아직 작성된 게시글이 없어요";

  return { searchKeyword, setSearchKeyword, filteredPosts, emptyMessage };
}

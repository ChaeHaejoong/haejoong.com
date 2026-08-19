import PostCard from "@/entities/post/ui/post-card/PostCard";
import type { PostResponseDto } from "@haejoong.com/shared";

type PostListProps = {
  posts: PostResponseDto[];
  emptyMessage?: string;
};

export default function PostList({
  posts,
  emptyMessage,
}: PostListProps) {
  if (!posts?.length)
    return <p className="text-center text-muted mt-30 md:mt-50">{emptyMessage}</p>;

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

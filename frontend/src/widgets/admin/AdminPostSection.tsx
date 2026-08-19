import type { PostResponseDto } from "@haejoong.com/shared";
import { formatDate } from "@/shared/lib/formatDate";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { Link } from "react-router-dom";

type AdminPostSectionProps = {
  title: string;
  emptyMessage: string;
  posts: PostResponseDto[];
  isLoading: boolean;
  isPending: boolean;
  primaryActionLabel: string;
  onPrimaryAction: (post: PostResponseDto) => void;
  onEdit: (post: PostResponseDto) => void;
  onDelete: (post: PostResponseDto) => void;
};

export default function AdminPostSection({
  title,
  emptyMessage,
  posts,
  isLoading,
  isPending,
  primaryActionLabel,
  onPrimaryAction,
  onEdit,
  onDelete,
}: AdminPostSectionProps) {
  return (
    <section className="rounded-2xl border border-divider p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-title">{title}</h2>
        </div>
        <div className="rounded-lg border border-divider bg-bg px-3 py-1.5 text-xs text-subtle">
          {posts.length}
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-subtle">불러오는 중</div>
      ) : !posts.length ? (
        <div className="py-10 text-center text-sm text-subtle">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid gap-3 rounded-xl border border-divider p-3 lg:grid-cols-[120px_minmax(0,1fr)]"
            >
              <Link
                to={`/posts/${post.id}`}
                className="overflow-hidden rounded-lg bg-bg-subtle"
              >
                <img
                  src={getImageUrl(post.thumbnail) ?? post.thumbnail}
                  className="h-24 w-full object-cover"
                />
              </Link>

              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-subtle">
                      {formatDate(post.contentUpdatedAt ?? post.createdAt)}
                    </p>
                    <Link
                      to={`/posts/${post.id}`}
                      className="mt-1 block line-clamp-2 text-sm font-medium text-title hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onPrimaryAction(post)}
                      disabled={isPending}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs text-white disabled:opacity-50"
                    >
                      {primaryActionLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(post)}
                      disabled={isPending}
                      className="rounded-lg border border-divider px-3 py-1.5 text-xs text-body disabled:opacity-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(post)}
                      disabled={isPending}
                      className="rounded-lg border border-divider px-3 py-1.5 text-xs text-error disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-subtle">
                  <span>좋아요 {post.likes}</span>
                  <span className="h-1 w-1 rounded-full bg-divider" />
                  <span>댓글 {post.comments}</span>
                  <span className="h-1 w-1 rounded-full bg-divider" />
                  <span>ID {post.id.slice(0, 8)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

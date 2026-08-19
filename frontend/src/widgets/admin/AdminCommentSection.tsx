import type { CommentResponseDto, PostResponseDto } from "@haejoong.com/shared";
import { formatDate } from "@/shared/lib/formatDate";

type AdminCommentSectionProps = {
  posts: PostResponseDto[];
  selectedPostId: string;
  selectedNickname: string;
  authors: string[];
  comments: CommentResponseDto[];
  isLoading: boolean;
  isPending: boolean;
  onSelectPost: (value: string) => void;
  onSelectNickname: (value: string) => void;
  onEdit: (comment: CommentResponseDto) => void;
  onDelete: (comment: CommentResponseDto) => void;
};

export default function AdminCommentSection({
  posts,
  selectedPostId,
  selectedNickname,
  authors,
  comments,
  isLoading,
  isPending,
  onSelectPost,
  onSelectNickname,
  onEdit,
  onDelete,
}: AdminCommentSectionProps) {
  return (
    <section className="rounded-2xl border border-divider p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-title">댓글 관리</h2>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedPostId}
            onChange={(event) => onSelectPost(event.target.value)}
            className="min-w-60 max-w-xs rounded-lg border border-divider bg-bg px-3 py-2 text-xs text-body"
          >
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>

          <select
            value={selectedNickname}
            onChange={(event) => onSelectNickname(event.target.value)}
            className="rounded-lg border border-divider bg-bg px-3 py-2 text-xs text-body"
          >
            <option value="all">전체 유저</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!posts.length ? (
        <div className="py-10 text-center text-sm text-subtle">
          게시된 글이 없습니다.
        </div>
      ) : isLoading ? (
        <div className="py-10 text-center text-sm text-subtle">불러오는 중</div>
      ) : !comments.length ? (
        <div className="py-10 text-center text-sm text-subtle">
          댓글이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-xl border border-divider p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-medium text-title">
                      {comment.user.nickname}
                    </span>
                    <span className="rounded-md bg-bg-subtle px-1.5 py-0.5 text-xs text-subtle">
                      좋아요 {comment.likeCount}
                    </span>
                    {comment.parentId && (
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        답글
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-subtle">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(comment)}
                    disabled={isPending}
                    className="rounded-lg border border-divider px-3 py-1.5 text-xs text-body disabled:opacity-50"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment)}
                    disabled={isPending}
                    className="rounded-lg border border-divider px-3 py-1.5 text-xs text-error disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-body">
                {comment.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

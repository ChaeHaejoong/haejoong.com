import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { UserCommentResponseDto } from "@haejoong.com/shared";
import { formatDate } from "@/shared/lib/formatDate";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { FaRegComment } from "react-icons/fa";
import { FiCornerDownRight } from "react-icons/fi";

interface MyPageCommentsSectionProps {
  comments: UserCommentResponseDto[];
  total: number;
  totalPages: number;
  page: number;
  isCommentsFetching: boolean;
  onPageChange: (page: number) => void;
  onEditComment: (commentId: string, currentContent: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function MyPageCommentsSection({
  comments,
  total,
  totalPages,
  page,
  isCommentsFetching,
  onPageChange,
  onEditComment,
  onDeleteComment,
}: MyPageCommentsSectionProps) {
  return (
    <section className="pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-title">작성한 댓글</h2>
        <span className="text-sm text-subtle">
          {isCommentsFetching ? "불러오는 중..." : `총 ${total}개`}
        </span>
      </div>

      {!comments.length ? (
        <p className="py-12 text-center text-sm text-subtle">
          아직 작성한 댓글이 없어요.
        </p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="border-t border-divider py-4 sm:py-5">
              <div className="flex gap-3 sm:gap-4">
                <Link
                  to={`/posts/${comment.postId}`}
                  className="block shrink-0 overflow-hidden rounded-lg"
                >
                  <img
                    src={
                      getImageUrl(comment.postThumbnail) ??
                      comment.postThumbnail
                    }
                    className="h-18 w-18 sm:h-24 sm:w-24 object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs text-subtle">
                        {comment.parentId ? (
                          <span className="flex gap-1.5 items-center">
                            <FiCornerDownRight size={12} /> 답글
                          </span>
                        ) : (
                          <span className="flex gap-1.5 items-center">
                            <FaRegComment size={12} /> 댓글
                          </span>
                        )}
                      </p>
                      <Link
                        to={`/posts/${comment.postId}`}
                        className="line-clamp-1 text-sm font-semibold text-title hover:text-primary transition-colors"
                      >
                        {comment.postTitle}
                      </Link>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onEditComment(comment.id, comment.content)
                        }
                        className="p-1.5 text-subtle hover:text-title transition-colors cursor-pointer"
                        title="댓글 수정"
                        aria-label="댓글 수정"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(comment.id)}
                        className="p-1.5 text-subtle hover:text-error transition-colors cursor-pointer"
                        title="댓글 삭제"
                        aria-label="댓글 삭제"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-body">
                    {comment.content}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-subtle">
                    <span>{formatDate(comment.createdAt)}</span>
                    <span>&middot;</span>
                    <span>좋아요 {comment.likeCount}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm text-subtle disabled:opacity-30 hover:text-title transition-colors cursor-pointer"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`h-8 min-w-8 px-2 text-sm cursor-pointer rounded transition-colors ${
                  pageNumber === page
                    ? "font-semibold text-title"
                    : "text-subtle hover:text-title"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm text-subtle disabled:opacity-30 hover:text-title transition-colors cursor-pointer"
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}

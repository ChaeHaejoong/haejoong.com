import type { CommentResponseDto } from "@haejoong.com/shared";
import { formatDate } from "@/shared/lib/formatDate";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import CommentReplyForm from "@/features/comment/reply/ui/CommentReplyForm";
import CommentReply from "./CommentReply";

interface CommentProps {
  comment: CommentResponseDto;
  isLiked?: boolean;
  onLikeClick?: () => void;
  onReplyLikeClick?: (replyId: string) => void;
  canManage?: boolean;
  canManageReply?: (replyUserId: string) => boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onReplyEditClick?: (replyId: string) => void;
  onReplyDeleteClick?: (replyId: string) => void;
  onReplyClick?: () => void;
  showReplyForm?: boolean;
  replyContent?: string;
  onReplyContentChange?: (content: string) => void;
  onReplySubmit?: () => void;
  isSubmitting?: boolean;
}

export default function Comment({
  comment,
  isLiked = false,
  onLikeClick,
  onReplyLikeClick,
  canManage = false,
  canManageReply,
  onEditClick,
  onDeleteClick,
  onReplyEditClick,
  onReplyDeleteClick,
  onReplyClick,
  showReplyForm = false,
  replyContent = "",
  onReplyContentChange,
  onReplySubmit,
  isSubmitting = false,
}: CommentProps) {
  const hasReplies = !!comment.replies?.length;

  return (
    <div className="border-divider border-b px-4">
      <div
        className="flex gap-3 sm:gap-4 py-4 sm:py-6 relative group"
        onDoubleClick={onLikeClick}
      >
        <img
          src={getImageUrl(comment.user.avatarUrl) ?? "/imgs/icon.png"}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
        />

        <div className="flex-1 pr-10">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <span className="font-semibold text-title text-sm">
              {comment.user.nickname}
            </span>

            <span className="text-xs md:text-sm text-muted">
              {formatDate(comment.createdAt)}
            </span>
            {comment.contentUpdatedAt !== null && (
              <span className="text-xs md:text-sm text-muted">(수정됨)</span>
            )}
          </div>

          <p className="text-sm sm:text-base text-body leading-relaxed mb-2">
            {comment.content}
          </p>

          <div className="flex flex-wrap gap-3 text-xs md:text-sm text-subtle">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReplyClick?.();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
              }}
              className="cursor-pointer hover:text-primary"
            >
              답글 달기
            </button>

            {canManage && (
              <>
                <span>|</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick?.();
                  }}
                  className="cursor-pointer hover:text-title"
                >
                  수정
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick?.();
                  }}
                  className="cursor-pointer hover:text-error"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onLikeClick}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full 
                     transition-all duration-200 hover:bg-bg-subtle"
        >
          {isLiked ? (
            <AiFillHeart className="w-3 h-3 md:w-5 md:h-5 text-error animate-heartBeat" />
          ) : (
            <AiOutlineHeart className="w-3 h-3 md:w-5 md:h-5 text-subtle hover:text-red-500 transition-colors" />
          )}
          <span className="text-subtle text-xs md:text-sm">
            {comment.likeCount}
          </span>
        </button>
      </div>

      {/* 대댓글 표시 */}
      {hasReplies && (
        <div className="ml-6 md:ml-12">
          {comment.replies!.map((reply) => (
            <CommentReply
              key={reply.id}
              comment={reply}
              isLiked={reply.isLiked || false}
              onLikeClick={() => onReplyLikeClick?.(reply.id)}
              canManage={canManageReply?.(reply.user.id) ?? false}
              onEditClick={() => onReplyEditClick?.(reply.id)}
              onDeleteClick={() => onReplyDeleteClick?.(reply.id)}
            />
          ))}
        </div>
      )}

      {/* 대댓글 입력 폼 */}
      {showReplyForm && (
        <div className="ml-6 md:ml-12 pt-2 pb-6 border-divider">
          <CommentReplyForm
            value={replyContent}
            onChange={(value) => onReplyContentChange?.(value)}
            onCancel={onReplyClick}
            onSubmit={onReplySubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}

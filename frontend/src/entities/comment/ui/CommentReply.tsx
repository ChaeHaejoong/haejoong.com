import type { CommentReplyDto } from "@haejoong.com/shared";
import { formatDate } from "@/shared/lib/formatDate";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface CommentReplyProps {
  comment: CommentReplyDto;
  isLiked: boolean;
  onLikeClick?: () => void;
  canManage?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export default function CommentReply({
  comment,
  isLiked,
  onLikeClick,
  canManage = false,
  onEditClick,
  onDeleteClick,
}: CommentReplyProps) {
  return (
    <div
      className="flex gap-3 sm:gap-4 py-4 sm:py-6 relative"
      onDoubleClick={onLikeClick}
    >
      <img
        src={getImageUrl(comment.user.avatarUrl) ?? "/imgs/icon.png"}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
      />

      <div className="flex-1 pr-10">
        <div className="flex items-center gap-1.5 sm:gap-3 mb-1">
          <span className="font-semibold text-title text-sm">
            {comment.user.nickname}
          </span>
          <span className="text-xs md:text-sm text-muted">
            {formatDate(comment.createdAt)}
          </span>
          {comment.contentUpdatedAt !== null && (
            <span className="text-xs md:text-sm text-subtle">(수정됨)</span>
          )}
        </div>

        <p className="text-sm sm:text-base text-body leading-relaxed mb-2">
          {comment.content}
        </p>

        {canManage && (
          <div className="flex items-center gap-3 text-xs md:text-sm text-subtle">
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
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onLikeClick?.();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
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
  );
}

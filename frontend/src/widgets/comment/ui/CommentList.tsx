import Comment from "@/entities/comment/ui/Comment";
import useCommentList from "../model/useCommentList";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const {
    comments,
    currentUserId,
    isLoading,
    replyingTo,
    replyContent,
    setReplyContent,
    isSubmittingReply,
    handleLikeClick,
    handleReplyClick,
    handleReplySubmit,
    handleEditClick,
    handleDeleteClick,
  } = useCommentList(postId);

  if (isLoading) {
    return <div>댓글 로딩 중...</div>;
  }

  return (
    <div className="pb-3 sm:pb-4">
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          isLiked={comment.isLiked}
          onLikeClick={() => handleLikeClick(comment.id)}
          onReplyLikeClick={handleLikeClick}
          canManage={comment.user.id === currentUserId}
          canManageReply={(replyUserId) => replyUserId === currentUserId}
          onEditClick={() => handleEditClick(comment.id, comment.content)}
          onDeleteClick={() => handleDeleteClick(comment.id)}
          onReplyEditClick={(replyId) => {
            const reply = comment.replies?.find((item) => item.id === replyId);
            if (!reply) return;
            handleEditClick(reply.id, reply.content);
          }}
          onReplyDeleteClick={handleDeleteClick}
          onReplyClick={() => handleReplyClick(comment.id)}
          showReplyForm={replyingTo === comment.id}
          replyContent={replyingTo === comment.id ? replyContent : ""}
          onReplyContentChange={setReplyContent}
          onReplySubmit={() => handleReplySubmit(comment.id)}
          isSubmitting={isSubmittingReply}
        />
      ))}
    </div>
  );
}

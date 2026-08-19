import { useState } from "react";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useToggleCommentLike,
  useUpdateComment,
} from "@/entities/comment/model/useComments";
import { useMe } from "@/entities/user/model/useMe";
import { useLoginModalStore } from "@/features/auth/login/store/useLoginModalStore";
import { useModalStore } from "@/shared/store/useModalStore";
import { verifyPassword } from "@/entities/user/api/verifyPassword";
import { toast } from "@/shared/store/useToastStore";

export default function useCommentList(postId: string) {
  const { data: comments, isLoading } = useComments(postId);
  const toggleLikeMutation = useToggleCommentLike(postId);
  const createCommentMutation = useCreateComment(postId);
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const { isLoggedIn, user } = useMe();
  const openModal = useModalStore((state) => state.openModal);
  const openPrompt = useModalStore((state) => state.openPrompt);
  const openLoginModal = useLoginModalStore((state) => state.open);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const ensureLoggedIn = () => {
    if (isLoggedIn) return true;

    openModal({
      message: "로그인 하면 댓글 기능을 사용할 수 있어요",
      onConfirm: () => openLoginModal(),
    });
    return false;
  };

  const handleLikeClick = (commentId: string) => {
    if (!ensureLoggedIn()) return;
    toggleLikeMutation.mutate(commentId);
  };

  const handleReplyClick = (commentId: string) => {
    if (!ensureLoggedIn()) return;

    setReplyingTo((prev) => (prev === commentId ? null : commentId));
    setReplyContent("");
  };

  const handleReplySubmit = (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    createCommentMutation.mutate(
      {
        content: replyContent,
        parentId: parentCommentId,
      },
      {
        onSuccess: () => {
          setReplyingTo(null);
          setReplyContent("");
        },
      },
    );
  };

  const withPasswordVerification = (
    title: string,
    onVerified: () => Promise<void>,
  ) => {
    openPrompt({
      title,
      message: "비밀번호를 입력해 주세요.",
      inputType: "password",
      placeholder: "비밀번호",
      onConfirm: async (password) => {
        if (!password?.trim()) {
          toast.error("비밀번호를 입력해 주세요");
          return;
        }

        try {
          await verifyPassword(password);
          await onVerified();
        } catch {
          toast.error("비밀번호가 올바르지 않거나 요청 처리에 실패했어요");
        }
      },
    });
  };

  const handleEditClick = (commentId: string, currentContent: string) => {
    if (!ensureLoggedIn()) return;

    withPasswordVerification("댓글 수정", async () => {
      openPrompt({
        title: "댓글 수정",
        message: "수정할 댓글 내용을 입력해 주세요.",
        inputMode: "textarea",
        initialValue: currentContent,
        onConfirm: async (content) => {
          const nextContent = content?.trim();

          if (!nextContent) {
            toast.error("수정할 댓글 내용을 입력해 주세요");
            return;
          }

          try {
            await updateCommentMutation.mutateAsync({
              commentId,
              dto: { content: nextContent },
            });
            toast.success("댓글이 수정되었어요");
          } catch {
            toast.error("댓글 수정에 실패했어요");
          }
        },
      });
    });
  };

  const handleDeleteClick = (commentId: string) => {
    if (!ensureLoggedIn()) return;

    withPasswordVerification("댓글 삭제", async () => {
      try {
        await deleteCommentMutation.mutateAsync(commentId);
        toast.success("댓글이 삭제되었어요");
      } catch {
        toast.error("댓글 삭제에 실패했어요");
      }
    });
  };

  return {
    comments,
    currentUserId: user?.id,
    isLoading,
    replyingTo,
    replyContent,
    setReplyContent,
    isSubmittingReply: createCommentMutation.isPending,
    handleLikeClick,
    handleReplyClick,
    handleReplySubmit,
    handleEditClick,
    handleDeleteClick,
  };
}

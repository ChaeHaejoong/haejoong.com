import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteComment, updateComment } from "@/entities/comment/api";
import { verifyPassword } from "@/entities/user/api/verifyPassword";
import { useModalStore } from "@/shared/store/useModalStore";
import { useMe } from "@/entities/user/model/useMe";
import { useMyComments } from "@/entities/user/model/useMyComments";

const PAGE_SIZE = 5;

export default function useMyPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  // loader가 캐시를 미리 적재하므로 isLoading이 즉시 false이고 user가 보장됩니다.
  const { user, isAdmin } = useMe();
  const openModal = useModalStore((state) => state.openModal);
  const openPrompt = useModalStore((state) => state.openPrompt);
  const { data: myCommentsPage, isFetching: isCommentsFetching } =
    useMyComments(page, PAGE_SIZE);

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-comments"] });
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      await queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateComment(commentId, { content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-comments"] });
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      await queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

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
          openModal({ message: "비밀번호를 입력해 주세요" });
          return;
        }

        try {
          await verifyPassword(password);
          await onVerified();
        } catch {
          openModal({
            message: "비밀번호가 올바르지 않거나 요청 처리에 실패했어요",
          });
        }
      },
    });
  };

  const handleEditMyComment = (commentId: string, currentContent: string) => {
    withPasswordVerification("내 댓글 수정", async () => {
      openPrompt({
        title: "내 댓글 수정",
        message: "수정할 댓글 내용을 입력해 주세요.",
        inputMode: "textarea",
        initialValue: currentContent,
        onConfirm: async (content) => {
          const nextContent = content?.trim();

          if (!nextContent) {
            openModal({ message: "수정할 댓글 내용을 입력해 주세요" });
            return;
          }

          try {
            await updateCommentMutation.mutateAsync({
              commentId,
              content: nextContent,
            });
            openModal({ message: "댓글이 수정되었어요" });
          } catch {
            openModal({ message: "댓글 수정에 실패했어요" });
          }
        },
      });
    });
  };

  const handleDeleteMyComment = (commentId: string) => {
    withPasswordVerification("내 댓글 삭제", async () => {
      try {
        await deleteCommentMutation.mutateAsync(commentId);
        openModal({ message: "댓글이 삭제되었어요" });
      } catch {
        openModal({ message: "댓글 삭제에 실패했어요" });
      }
    });
  };

  return {
    user,
    isAdmin,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    myCommentsPage,
    myComments: myCommentsPage?.items ?? [],
    totalPages: myCommentsPage?.totalPages ?? 0,
    total: myCommentsPage?.total ?? 0,
    isCommentsFetching,
    handleEditMyComment,
    handleDeleteMyComment,
  };
}

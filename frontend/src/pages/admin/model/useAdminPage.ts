import type {
  CommentResponseDto,
  PostResponseDto,
  UpdatePostDto,
  UserResponseDto,
} from "@haejoong.com/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "@/entities/user/model/useMe";
import {
  deleteComment,
  fetchComments,
  updateComment,
} from "@/entities/comment/api";
import {
  deleteAdminPost,
  deleteAdminUser,
  fetchAdminUsers,
  fetchDraftPosts,
  fetchPublishedPosts,
  updateAdminPost,
  updateAdminUser,
} from "@/pages/admin/api";
import { useModalStore } from "@/shared/store/useModalStore";

function getErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || error?.message || fallback;
}

function flattenComments(comments: CommentResponseDto[]) {
  return comments.flatMap((comment) => [
    { ...comment, replies: undefined },
    ...(comment.replies ?? []),
  ]);
}

export function useAdminPage() {
  const queryClient = useQueryClient();
  const { user } = useMe();
  const openModal = useModalStore((state) => state.openModal);
  const openPrompt = useModalStore((state) => state.openPrompt);

  const navigate = useNavigate();
  const [selectedCommentPostId, setSelectedCommentPostId] = useState("");
  const [selectedNickname, setSelectedNickname] = useState("all");

  const draftsQuery = useQuery<PostResponseDto[]>({
    queryKey: ["admin", "draft-posts"],
    queryFn: fetchDraftPosts,
  });

  const publishedPostsQuery = useQuery<PostResponseDto[]>({
    queryKey: ["admin", "published-posts"],
    queryFn: fetchPublishedPosts,
  });

  const usersQuery = useQuery<UserResponseDto[]>({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
  });

  const publishedPosts = publishedPostsQuery.data ?? [];
  const draftPosts = draftsQuery.data ?? [];
  const users = usersQuery.data ?? [];

  useEffect(() => {
    if (!publishedPosts.length) {
      setSelectedCommentPostId("");
      return;
    }

    if (
      !selectedCommentPostId ||
      !publishedPosts.some((post) => post.id === selectedCommentPostId)
    ) {
      setSelectedCommentPostId(publishedPosts[0].id);
    }
  }, [publishedPosts, selectedCommentPostId]);

  useEffect(() => {
    setSelectedNickname("all");
  }, [selectedCommentPostId]);

  const commentsQuery = useQuery<CommentResponseDto[]>({
    queryKey: ["admin", "comments", selectedCommentPostId],
    queryFn: () => fetchComments(selectedCommentPostId),
    enabled: !!selectedCommentPostId,
  });

  const comments = useMemo(
    () => flattenComments(commentsQuery.data ?? []),
    [commentsQuery.data],
  );

  const commentAuthors = useMemo(
    () =>
      Array.from(
        new Set(comments.map((comment) => comment.user.nickname)),
      ).sort((left, right) => left.localeCompare(right, "ko")),
    [comments],
  );

  const filteredComments = useMemo(() => {
    if (selectedNickname === "all") {
      return comments;
    }

    return comments.filter(
      (comment) => comment.user.nickname === selectedNickname,
    );
  }, [comments, selectedNickname]);

  const selectedCommentPost = useMemo(
    () => publishedPosts.find((post) => post.id === selectedCommentPostId),
    [publishedPosts, selectedCommentPostId],
  );

  const invalidateAdminData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "draft-posts"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "published-posts"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] }),
    ]);
  };

  const postMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdatePostDto;
    }) => updateAdminPost(postId, payload),
    onSuccess: async () => {
      await invalidateAdminData();
    },
    onError: (error) => {
      openModal({
        title: "게시글 작업 실패",
        message: getErrorMessage(error, "게시글 작업에 실패했습니다."),
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deleteAdminPost,
    onSuccess: async () => {
      await invalidateAdminData();
      openModal({
        title: "삭제 완료",
        message: "게시글을 삭제했습니다.",
      });
    },
    onError: (error) => {
      openModal({
        title: "삭제 실패",
        message: getErrorMessage(error, "게시글 삭제에 실패했습니다."),
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      nickname,
      avatarImageId,
    }: {
      userId: string;
      nickname: string;
      avatarImageId: string | null;
    }) => updateAdminUser(userId, { nickname, avatarImageId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      openModal({
        title: "수정 완료",
        message: "유저 정보를 수정했습니다.",
      });
    },
    onError: (error) => {
      openModal({
        title: "수정 실패",
        message: getErrorMessage(error, "유저 수정에 실패했습니다."),
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      openModal({
        title: "삭제 완료",
        message: "유저를 삭제했습니다.",
      });
    },
    onError: (error) => {
      openModal({
        title: "삭제 실패",
        message: getErrorMessage(error, "유저 삭제에 실패했습니다."),
      });
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
      await queryClient.invalidateQueries({
        queryKey: ["admin", "comments", selectedCommentPostId],
      });
      openModal({
        title: "수정 완료",
        message: "댓글을 수정했습니다.",
      });
    },
    onError: (error) => {
      openModal({
        title: "수정 실패",
        message: getErrorMessage(error, "댓글 수정에 실패했습니다."),
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "comments", selectedCommentPostId],
      });
      openModal({
        title: "삭제 완료",
        message: "댓글을 삭제했습니다.",
      });
    },
    onError: (error) => {
      openModal({
        title: "삭제 실패",
        message: getErrorMessage(error, "댓글 삭제에 실패했습니다."),
      });
    },
  });

  const handleEditPost = (post: PostResponseDto) => {
    navigate(`/posts/${post.id}/edit`, { state: post });
  };

  const handleTogglePublish = (
    post: PostResponseDto,
    nextPublished: boolean,
  ) => {
    openModal({
      title: nextPublished ? "게시하기" : "임시저장 전환",
      message: nextPublished
        ? "이 글을 공개 게시글로 전환할까요?"
        : "이 글을 다시 임시저장 상태로 돌릴까요?",
      onConfirm: () => {
        void postMutation
          .mutateAsync({
            postId: post.id,
            payload: { published: nextPublished },
          })
          .then(() => {
            openModal({
              title: "상태 변경 완료",
              message: nextPublished
                ? "게시글을 공개 상태로 전환했습니다."
                : "게시글을 임시저장 상태로 전환했습니다.",
            });
          });
      },
    });
  };

  const handleDeletePost = (post: PostResponseDto) => {
    openModal({
      title: "게시글 삭제",
      message: `\"${post.title}\" 글을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`,
      onConfirm: () => {
        void deletePostMutation.mutateAsync(post.id);
      },
    });
  };

  const handleRenameUser = (targetUser: UserResponseDto) => {
    openPrompt({
      title: "유저 닉네임 수정",
      message: `${targetUser.userId} 계정의 닉네임을 변경합니다.`,
      initialValue: targetUser.nickname,
      onConfirm: (value) => {
        const nextNickname = value?.trim();

        if (!nextNickname) {
          openModal({ message: "닉네임을 입력해 주세요." });
          return;
        }

        void updateUserMutation.mutateAsync({
          userId: targetUser.id,
          nickname: nextNickname,
          avatarImageId: targetUser.avatarImageId,
        });
      },
    });
  };

  const handleDeleteUser = (targetUser: UserResponseDto) => {
    if (targetUser.id === user?.id) {
      openModal({
        message:
          "현재 로그인한 관리자 계정은 여기서 삭제하지 않도록 막아두었습니다.",
      });
      return;
    }

    openModal({
      title: "유저 삭제",
      message: `${targetUser.nickname} (${targetUser.userId}) 계정을 삭제할까요?`,
      onConfirm: () => {
        void deleteUserMutation.mutateAsync(targetUser.id);
      },
    });
  };

  const handleEditComment = (comment: CommentResponseDto) => {
    openPrompt({
      title: "댓글 수정",
      message: `${comment.user.nickname} 님의 댓글을 수정합니다.`,
      inputMode: "textarea",
      initialValue: comment.content,
      onConfirm: (value) => {
        const nextContent = value?.trim();

        if (!nextContent) {
          openModal({ message: "댓글 내용을 입력해 주세요." });
          return;
        }

        void updateCommentMutation.mutateAsync({
          commentId: comment.id,
          content: nextContent,
        });
      },
    });
  };

  const handleDeleteComment = (comment: CommentResponseDto) => {
    openModal({
      title: "댓글 삭제",
      message: `${comment.user.nickname} 님의 댓글을 삭제할까요?`,
      onConfirm: () => {
        void deleteCommentMutation.mutateAsync(comment.id);
      },
    });
  };

  return {
    user,
    draftPosts,
    publishedPosts,
    users,
    comments,
    filteredComments,
    commentAuthors,
    selectedCommentPost,
    selectedCommentPostId,
    selectedNickname,
    setSelectedCommentPostId,
    setSelectedNickname,
    isDraftsLoading: draftsQuery.isLoading,
    isPublishedPostsLoading: publishedPostsQuery.isLoading,
    isUsersLoading: usersQuery.isLoading,
    isCommentsLoading: commentsQuery.isLoading,
    isPostsPending: postMutation.isPending || deletePostMutation.isPending,
    isUsersPending:
      updateUserMutation.isPending || deleteUserMutation.isPending,
    isCommentsPending:
      updateCommentMutation.isPending || deleteCommentMutation.isPending,
    handleEditPost,
    handleTogglePublish,
    handleDeletePost,
    handleRenameUser,
    handleDeleteUser,
    handleEditComment,
    handleDeleteComment,
  };
}

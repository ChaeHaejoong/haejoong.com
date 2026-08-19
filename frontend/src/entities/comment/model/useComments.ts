import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "@/entities/comment/api";
import type {
  CommentResponseDto,
  CreateCommentDto,
  UpdateCommentDto,
} from "@haejoong.com/shared";

export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCommentDto) => createComment(postId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      dto,
    }: {
      commentId: string;
      dto: UpdateCommentDto;
    }) => updateComment(commentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["my-comments"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["my-comments"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}

export function useToggleCommentLike(postId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => toggleCommentLike(commentId),
    onSuccess: (response, commentId) => {
      // 현재 postId의 댓글 데이터 가져오기
      if (postId) {
        const previousComments = queryClient.getQueryData<CommentResponseDto[]>(
          ["comments", postId],
        );

        if (previousComments) {
          // 해당 댓글의 liked 상태 및 likeCount 업데이트
          let updated = false;
          const updatedComments = previousComments.map((comment) => {
            if (comment.id === commentId) {
              updated = true;
              return {
                ...comment,
                isLiked: response.liked,
                likeCount: response.likeCount,
              };
            }

            if (comment.replies?.length) {
              const updatedReplies = comment.replies.map((reply) => {
                if (reply.id === commentId) {
                  updated = true;
                  return {
                    ...reply,
                    isLiked: response.liked,
                    likeCount: response.likeCount,
                  };
                }
                return reply;
              });

              return {
                ...comment,
                replies: updatedReplies,
              };
            }

            return comment;
          });
          queryClient.setQueryData(["comments", postId], updatedComments);

          if (!updated) {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
          }
        }
      } else {
        // postId가 없으면 전체 comments 무효화
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}

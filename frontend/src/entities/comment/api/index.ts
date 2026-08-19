import { api } from "@/shared/api";
import type {
  CreateCommentDto,
  CommentResponseDto,
  UpdateCommentDto,
} from "@haejoong.com/shared";

export async function createComment(
  postId: string,
  dto: CreateCommentDto,
): Promise<CommentResponseDto> {
  const { data } = await api.post(`/comments/posts/${postId}`, dto);
  return data;
}

export async function fetchComments(
  postId: string,
): Promise<CommentResponseDto[]> {
  const { data } = await api.get(`/comments/posts/${postId}`);
  return data;
}

export async function toggleCommentLike(
  commentId: string,
): Promise<{ liked: boolean; likeCount: number }> {
  const { data } = await api.post(`/comments/${commentId}/like`);
  return data;
}

export async function updateComment(
  commentId: string,
  dto: UpdateCommentDto,
): Promise<CommentResponseDto> {
  const { data } = await api.patch(`/comments/${commentId}`, dto);
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

import { z } from "zod";

export const userCommentResponseSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  createdAt: z.date(),
  parentId: z.uuid().nullable(),
  likeCount: z.number(),
  postId: z.uuid(),
  postTitle: z.string(),
  postThumbnail: z.string(),
});

export const myCommentsPageResponseSchema = z.object({
  items: z.array(userCommentResponseSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type UserCommentResponseDto = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  likeCount: number;
  postId: string;
  postTitle: string;
  postThumbnail: string;
};

export type MyCommentsPageResponseDto = {
  items: UserCommentResponseDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

import { z } from "zod";

export const commentUserSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
  avatarUrl: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
});

export const commentReplySchema = z.object({
  id: z.uuid(),
  content: z.string(),
  postId: z.uuid(),
  parentId: z.uuid().nullable(),
  userId: z.uuid(),
  likeCount: z.number(),
  isLiked: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  contentUpdatedAt: z.date().nullable(),
  user: commentUserSchema,
});

export type CommentUserDto = {
  id: string;
  nickname: string;
  avatarUrl: string | null;
};

export type CommentReplyDto = {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
  userId: string;
  likeCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
  contentUpdatedAt: Date | null;
  user: CommentUserDto;
};

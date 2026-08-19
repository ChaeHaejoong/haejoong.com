import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해 주세요")
    .max(100, "제목은 100자 이하로 입력해 주세요"),
  content: z.string().min(1, "내용을 입력해 주세요"),
  thumbnail: z.string().min(1, "썸네일을 선택해 주세요"),
  published: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export type CreatePostDto = {
  title: string;
  content: string;
  thumbnail: string;
  published?: boolean;
  tagIds?: string[];
};

import { z } from "zod";

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글 내용을 입력해 주세요")
    .max(500, "댓글은 500자 이하로 입력해 주세요"),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

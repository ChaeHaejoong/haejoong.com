import { z } from "zod";
import { commentReplySchema } from "./comment-reply.dto.js";
import type { CommentReplyDto } from "./comment-reply.dto.js";

export const commentResponseSchema = commentReplySchema.extend({
  replies: z.array(commentReplySchema).optional(),
});

export type CommentResponseDto = CommentReplyDto & {
  replies?: CommentReplyDto[];
};

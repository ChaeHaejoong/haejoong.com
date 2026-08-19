import z from "zod";
import { tagSchema } from "../tag/tag.dto.js";
import type { TagDto } from "../tag/tag.dto.js";

export const postResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  thumbnail: z.string(),
  views: z.number().default(0),
  likes: z.number(),
  isLiked: z.boolean().optional(),
  comments: z.number(),
  tags: z.array(tagSchema).optional(),
  createdAt: z.date(),
  contentUpdatedAt: z.date().nullable(),
});

export type PostResponseDto = {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  comments: number;
  tags?: TagDto[];
  createdAt: Date;
  contentUpdatedAt: Date | null;
};

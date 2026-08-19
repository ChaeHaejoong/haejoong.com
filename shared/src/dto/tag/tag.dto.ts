import { z } from "zod";

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "태그 이름을 입력해 주세요")
    .max(30, "태그 이름은 30자 이하여야 해요"),
});

export type TagDto = { id: string; name: string };
export type CreateTagDto = { name: string };

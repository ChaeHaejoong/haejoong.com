import { z } from "zod";

export const updateUserSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상이어야 해요")
    .max(20, "닉네임은 20자 이하여야 해요"),
  avatarImageId: z.uuid().nullable(),
});

export type UpdateUserDto = { nickname: string; avatarImageId: string | null };

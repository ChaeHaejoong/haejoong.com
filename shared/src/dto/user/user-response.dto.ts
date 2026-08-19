import { z } from "zod";
import { UserRole } from "../../enum/user-role.enum.js";

export const userResponseSchema = z.object({
  id: z.uuid(),

  userId: z
    .string()
    .min(4)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),

  nickname: z.string().min(1).max(20),

  avatarImageId: z.uuid().nullable(),

  avatarUrl: z
    .string()
    .nullish()
    .transform((v) => v ?? null),

  createdAt: z.date(),

  role: z.enum(UserRole),
});

export type UserResponseDto = {
  id: string;
  userId: string;
  nickname: string;
  avatarImageId: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  role: UserRole;
};

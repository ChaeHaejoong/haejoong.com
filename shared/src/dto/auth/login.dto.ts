import { z } from "zod";

export const loginSchema = z.object({
  userId: z
    .string()
    .min(4, "아이디는 4글자 이상이어야 해요")
    .max(20, "아이디는 20글자 이하여야 해요"),
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

export type LoginDto = { userId: string; password: string };

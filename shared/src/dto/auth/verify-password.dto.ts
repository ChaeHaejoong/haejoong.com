import { z } from "zod";

export const verifyPasswordSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

export type VerifyPasswordDto = { password: string };

import { z } from "zod";

export const registerSchema = z.object({
  userId: z
    .string()
    .min(4, "아이디는 4글자 이상이어야 해요")
    .max(20, "아이디는 20글자 이하여야 해요")
    .regex(/^[a-zA-Z0-9_]+$/, "아이디는 영어와 숫자만 허용해요"),
  password: z
    .string()
    .min(8, "비밀번호는 8글자 이상이어야 해요")
    .max(100, "비밀번호는 100글자 이하여야 해요")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "비밀번호는 영어, 숫자, 특수문자를 포함해야 해요",
    ),
  nickname: z
    .string()
    .min(1, "닉네임은 1자 이상이어야 해요")
    .max(20, "닉네임은 20자 이하여야 해요"),
});

export type RegisterDto = {
  userId: string;
  password: string;
  nickname: string;
};

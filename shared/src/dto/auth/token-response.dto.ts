import { z } from "zod";

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
});

export type TokenResponseDto = { accessToken: string };

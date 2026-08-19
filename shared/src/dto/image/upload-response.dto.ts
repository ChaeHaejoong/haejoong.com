import { z } from "zod";

export const uploadImageResponseSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
});

export type UploadImageResponse = { id: string; url: string; filename: string };

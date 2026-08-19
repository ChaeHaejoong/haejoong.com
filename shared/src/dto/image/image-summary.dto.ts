import { z } from "zod";

export const imageSummarySchema = z.object({
  id: z.uuid(),
  url: z.string(),
  filename: z.string(),
  createdAt: z.date(),
});

export type ImageSummaryDto = {
  id: string;
  url: string;
  filename: string;
  createdAt: Date;
};

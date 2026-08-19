import { createPostSchema } from "./create-post.dto.js";
import type { CreatePostDto } from "./create-post.dto.js";

export const updatePostSchema = createPostSchema.partial();

export type UpdatePostDto = Partial<CreatePostDto>;

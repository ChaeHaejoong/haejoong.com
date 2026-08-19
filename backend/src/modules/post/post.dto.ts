import { createZodDto } from 'nestjs-zod';
import { createPostSchema, updatePostSchema } from '@haejoong.com/shared';

export class CreatePostDto extends createZodDto(createPostSchema) {}
export class UpdatePostDto extends createZodDto(updatePostSchema) {}

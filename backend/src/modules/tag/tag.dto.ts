import { createZodDto } from 'nestjs-zod';
import { createTagSchema } from '@haejoong.com/shared';

export class CreateTagDto extends createZodDto(createTagSchema) {}

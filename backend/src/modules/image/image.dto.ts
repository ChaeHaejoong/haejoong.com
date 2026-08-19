import { createZodDto } from 'nestjs-zod';
import {
  imageSummarySchema,
  uploadImageResponseSchema,
} from '@haejoong.com/shared';

export class UploadImageResponseDto extends createZodDto(
  uploadImageResponseSchema,
) {}

export class ImageSummaryDto extends createZodDto(imageSummarySchema) {}

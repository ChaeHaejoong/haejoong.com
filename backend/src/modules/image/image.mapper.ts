import { Injectable } from '@nestjs/common';
import {
  imageSummarySchema,
  ImageSummaryDto,
  uploadImageResponseSchema,
  UploadImageResponse,
} from '@haejoong.com/shared';
import { Image } from './image.entity';

@Injectable()
export class ImageMapper {
  toSummary(image: Image): ImageSummaryDto {
    return imageSummarySchema.parse({
      id: image.id,
      url: image.url,
      filename: image.filename,
      createdAt: image.createdAt,
    });
  }

  toUploadResponse(image: Image): UploadImageResponse {
    return uploadImageResponseSchema.parse({
      id: image.id,
      url: image.url,
      filename: image.filename,
    });
  }
}

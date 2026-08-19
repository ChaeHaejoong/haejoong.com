import { Injectable } from '@nestjs/common';
import { tagSchema, TagDto } from '@haejoong.com/shared';
import { Tag } from './tag.entity';

@Injectable()
export class TagMapper {
  toResponse(tag: Tag): TagDto {
    return tagSchema.parse({
      id: tag.id,
      name: tag.name,
    });
  }
}

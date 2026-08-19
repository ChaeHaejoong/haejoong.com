import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from '@haejoong.com/shared';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TagQueryService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly tagMapper: TagMapper,
  ) {}

  async findAll(): Promise<TagDto[]> {
    const tags = await this.tagRepository.find({ order: { name: 'ASC' } });
    return tags.map((tag) => this.tagMapper.toResponse(tag));
  }
}

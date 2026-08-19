import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './tag.dto';
import { PostTag } from '../post/entities/post-tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const existing = await this.tagRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('이미 존재하는 태그예요');
    const tag = this.tagRepository.create(dto);
    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('태그를 찾을 수 없어요');

    await this.tagRepository.manager.transaction(async (manager) => {
      await manager.delete(PostTag, { tagId: id });
      await manager.delete(Tag, { id });
    });
  }
}

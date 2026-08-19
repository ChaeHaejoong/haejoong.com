import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagQueryService } from './tag-query.service';
import { TagMapper } from './tag.mapper';
import { PostTag } from '../post/entities/post-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, PostTag])],
  controllers: [TagController],
  providers: [TagService, TagQueryService, TagMapper],
  exports: [TagService, TypeOrmModule],
})
export class TagModule {}

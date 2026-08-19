import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostTag } from './entities/post-tag.entity';
import { PostLikeSubscriber } from './post-like.subscriber';
import { ViewCountService } from './view-count.service';
import { TagModule } from '../tag/tag.module';
import { Tag } from '../tag/tag.entity';
import { PostQueryService } from './post-query.service';
import { PostResponseMapper } from './post-response.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike, PostTag, Tag]),
    TagModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostQueryService,
    PostResponseMapper,
    PostLikeSubscriber,
    ViewCountService,
  ],
})
export class PostModule {}

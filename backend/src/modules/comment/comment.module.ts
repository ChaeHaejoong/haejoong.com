import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CommentSubscriber } from './subscriber/comment.subscriber';
import { CommentLikeSubscriber } from './subscriber/comment-like.subscriber';
import { Post } from '../post/entities/post.entity';
import { CommentQueryService } from './comment-query.service';
import { CommentResponseMapper } from './comment-response.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike, Post])],
  providers: [
    CommentService,
    CommentQueryService,
    CommentResponseMapper,
    CommentSubscriber,
    CommentLikeSubscriber,
  ],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}

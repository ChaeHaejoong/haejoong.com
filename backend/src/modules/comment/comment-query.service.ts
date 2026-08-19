import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CommentResponseDto } from '@haejoong.com/shared';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CommentResponseMapper } from './comment-response.mapper';

@Injectable()
export class CommentQueryService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly likeRepo: Repository<CommentLike>,
    private readonly commentResponseMapper: CommentResponseMapper,
  ) {}

  async findAllByPostId(
    postId: string,
    userId?: string,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepo.find({
      where: { postId, parentId: IsNull() },
      relations: [
        'user',
        'user.avatar',
        'replies',
        'replies.user',
        'replies.user.avatar',
      ],
      order: { createdAt: 'ASC', replies: { createdAt: 'ASC' } },
    });

    return this.attachLikedState(comments, userId);
  }

  async findOne(id: string, userId?: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: [
        'user',
        'user.avatar',
        'replies',
        'replies.user',
        'replies.user.avatar',
      ],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없어요');
    }

    const [mapped] = await this.attachLikedState([comment], userId);
    return mapped;
  }

  private async attachLikedState(comments: Comment[], userId?: string) {
    const commentsWithLikes = comments.map((comment) => ({
      ...comment,
      isLiked: false,
      replies: comment.replies?.map((reply) => ({ ...reply, isLiked: false })),
    }));

    if (!userId || commentsWithLikes.length === 0) {
      return commentsWithLikes.map((comment) =>
        this.commentResponseMapper.toResponse(comment),
      );
    }

    const likedRows = await this.likeRepo.find({
      where: { userId },
      select: ['commentId'],
    });
    const likedSet = new Set(likedRows.map((row) => row.commentId));

    for (const comment of commentsWithLikes) {
      comment.isLiked = likedSet.has(comment.id);
      if (comment.replies) {
        for (const reply of comment.replies) {
          reply.isLiked = likedSet.has(reply.id);
        }
      }
    }

    return commentsWithLikes.map((comment) =>
      this.commentResponseMapper.toResponse(comment),
    );
  }
}

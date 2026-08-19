import { Injectable } from '@nestjs/common';
import {
  commentResponseSchema,
  CommentResponseDto,
} from '@haejoong.com/shared';
import { Comment } from './entities/comment.entity';

type CommentWithRelations = Comment & {
  isLiked?: boolean;
  user: {
    id: string;
    nickname: string;
    avatar?: {
      url: string;
    } | null;
  };
  replies?: Array<
    Comment & {
      isLiked?: boolean;
      user: {
        id: string;
        nickname: string;
        avatar?: {
          url: string;
        } | null;
      };
    }
  >;
};

@Injectable()
export class CommentResponseMapper {
  toResponse(comment: CommentWithRelations): CommentResponseDto {
    return commentResponseSchema.parse({
      ...comment,
      parentId: comment.parentId ?? null,
      contentUpdatedAt: comment.contentUpdatedAt ?? null,
      user: {
        id: comment.user.id,
        nickname: comment.user.nickname,
        avatarUrl: comment.user.avatar?.url ?? null,
      },
      replies: comment.replies?.map((reply) => ({
        ...reply,
        parentId: reply.parentId ?? null,
        contentUpdatedAt: reply.contentUpdatedAt ?? null,
        user: {
          id: reply.user.id,
          nickname: reply.user.nickname,
          avatarUrl: reply.user.avatar?.url ?? null,
        },
      })),
    });
  }
}

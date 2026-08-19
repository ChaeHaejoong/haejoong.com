import { Injectable } from '@nestjs/common';
import {
  myCommentsPageResponseSchema,
  MyCommentsPageResponseDto,
  userCommentResponseSchema,
  UserCommentResponseDto,
  userResponseSchema,
  UserResponseDto,
} from '@haejoong.com/shared';
import { Comment } from '../comment/entities/comment.entity';
import { User } from './user.entity';

@Injectable()
export class UserResponseMapper {
  toUserResponse(user: User): UserResponseDto {
    return userResponseSchema.parse({
      id: user.id,
      userId: user.userId,
      nickname: user.nickname,
      avatarImageId: user.avatarImageId ?? null,
      avatarUrl: user.avatar?.url ?? null,
      createdAt: user.createdAt,
      role: user.role,
    });
  }

  toUserCommentResponse(
    comment: Comment & { post?: { title?: string; thumbnail?: string } | null },
  ): UserCommentResponseDto {
    return userCommentResponseSchema.parse({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      parentId: comment.parentId ?? null,
      likeCount: comment.likeCount,
      postId: comment.postId,
      postTitle: comment.post?.title ?? '삭제된 게시글',
      postThumbnail: comment.post?.thumbnail ?? '/imgs/icon.png',
    });
  }

  toMyCommentsPageResponse(
    input: MyCommentsPageResponseDto,
  ): MyCommentsPageResponseDto {
    return myCommentsPageResponseSchema.parse(input);
  }
}

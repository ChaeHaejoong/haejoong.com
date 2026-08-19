import { Injectable } from '@nestjs/common';
import { postResponseSchema, PostResponseDto } from '@haejoong.com/shared';
import { Post } from './entities/post.entity';
import { PostTag } from './entities/post-tag.entity';

type PostWithRelations = Post & {
  postTags?: Array<PostTag & { tag?: { id: string; name: string } }>;
  isLiked?: boolean;
};

@Injectable()
export class PostResponseMapper {
  toResponse(post: PostWithRelations): PostResponseDto {
    return postResponseSchema.parse({
      id: post.id,
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail,
      views: post.views,
      likes: post.likes,
      isLiked: post.isLiked,
      comments: post.commentCount,
      tags: (post.postTags ?? []).flatMap((postTag) =>
        postTag.tag ? [{ id: postTag.tag.id, name: postTag.tag.name }] : [],
      ),
      createdAt: post.createdAt,
      contentUpdatedAt: post.contentUpdatedAt ?? null,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PostResponseDto, UserRole } from '@haejoong.com/shared';
import { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostResponseMapper } from './post-response.mapper';

@Injectable()
export class PostQueryService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly postResponseMapper: PostResponseMapper,
  ) {}

  async findPublished(userId?: string): Promise<PostResponseDto[]> {
    const posts = await this.findPosts({ published: true });
    return this.attachLikedState(posts, userId);
  }

  async findDrafts(authorId?: string): Promise<PostResponseDto[]> {
    const where: FindOptionsWhere<Post> = { published: false };
    if (authorId) {
      where.authorId = authorId;
    }

    const posts = await this.findPosts(where);
    return this.attachLikedState(posts, authorId);
  }

  async findOne(
    id: string,
    currentUser?: CurrentUserPayload,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        postTags: {
          tag: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없어요');
    }

    if (
      !post.published &&
      (!currentUser ||
        (currentUser.role !== UserRole.ADMIN &&
          currentUser.id !== post.authorId))
    ) {
      throw new NotFoundException('게시글을 찾을 수 없어요');
    }

    const isLiked = currentUser
      ? await this.postLikeRepository.exists({
          where: { postId: id, userId: currentUser.id },
        })
      : undefined;

    return this.postResponseMapper.toResponse({ ...post, isLiked });
  }

  private findPosts(where: FindOptionsWhere<Post>) {
    return this.postRepository.find({
      where,
      relations: {
        postTags: {
          tag: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  private async attachLikedState(posts: Post[], userId?: string) {
    if (!userId || posts.length === 0) {
      return posts.map((post) => this.postResponseMapper.toResponse(post));
    }

    const likedRows = await this.postLikeRepository.find({
      where: { userId },
      select: ['postId'],
    });
    const likedSet = new Set(likedRows.map((row) => row.postId));

    return posts.map((post) =>
      this.postResponseMapper.toResponse({
        ...post,
        isLiked: likedSet.has(post.id),
      }),
    );
  }
}

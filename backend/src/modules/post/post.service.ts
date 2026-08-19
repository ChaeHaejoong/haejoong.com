import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostTag } from './entities/post-tag.entity';
import { Tag } from '../tag/tag.entity';
import {
  CreatePostDto,
  UpdatePostDto,
  PostResponseDto,
} from '@haejoong.com/shared';
import { PostResponseMapper } from './post-response.mapper';

@Injectable()
export class PostService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly postResponseMapper: PostResponseMapper,
  ) {}

  async create(
    authorId: string,
    data: CreatePostDto,
  ): Promise<PostResponseDto> {
    const postId = await this.dataSource.transaction(async (manager) => {
      const { tagIds, ...postData } = data;
      const postRepository = manager.getRepository(Post);
      const postTagRepository = manager.getRepository(PostTag);
      const tagRepository = manager.getRepository(Tag);

      const post = postRepository.create({
        ...postData,
        authorId,
        contentUpdatedAt: null,
      });

      const saved = await postRepository.save(post);
      await this.replaceTags(
        postTagRepository,
        tagRepository,
        saved.id,
        tagIds,
      );

      return saved.id;
    });

    return this.getPostForWrite(postId);
  }

  async update(id: string, data: UpdatePostDto): Promise<PostResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const postRepository = manager.getRepository(Post);
      const postTagRepository = manager.getRepository(PostTag);
      const tagRepository = manager.getRepository(Tag);

      const post = await postRepository.findOne({ where: { id } });
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없어요');
      }

      if (data.title !== undefined) {
        post.title = data.title;
      }

      if (data.content !== undefined) {
        if (data.content !== post.content) {
          post.contentUpdatedAt = new Date();
        }
        post.content = data.content;
      }

      if (data.thumbnail !== undefined) {
        post.thumbnail = data.thumbnail;
      }

      if (data.published !== undefined) {
        post.published = data.published;
      }

      await postRepository.save(post);

      if (data.tagIds !== undefined) {
        await this.replaceTags(
          postTagRepository,
          tagRepository,
          id,
          data.tagIds,
        );
      }
    });

    return this.getPostForWrite(id);
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.softDelete(id);
  }

  async toggleLike(postId: string, userId: string) {
    const existingLike = await this.postLikeRepository.findOne({
      where: { postId, userId },
    });

    let liked: boolean;
    if (existingLike) {
      await this.postLikeRepository.remove(existingLike);
      liked = false;
    } else {
      const like = this.postLikeRepository.create({ postId, userId });
      await this.postLikeRepository.save(like);
      liked = true;
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });

    return { liked, likes: post?.likes ?? 0 };
  }

  private async getPostForWrite(id: string): Promise<PostResponseDto> {
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

    return this.postResponseMapper.toResponse(post);
  }

  private async replaceTags(
    postTagRepository: Repository<PostTag>,
    tagRepository: Repository<Tag>,
    postId: string,
    tagIds: string[] | undefined,
  ) {
    const normalizedTagIds = [...new Set(tagIds ?? [])];

    await postTagRepository.delete({ postId });

    if (normalizedTagIds.length === 0) {
      return;
    }

    const tags = await tagRepository.findBy({ id: In(normalizedTagIds) });
    if (tags.length !== normalizedTagIds.length) {
      throw new NotFoundException('존재하지 않는 태그가 포함되어 있어요');
    }

    await postTagRepository.insert(
      normalizedTagIds.map((tagId) => ({
        postId,
        tagId,
      })),
    );
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { Post } from '../post/entities/post.entity';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponseDto,
  UserRole,
} from '@haejoong.com/shared';
import { CommentQueryService } from './comment-query.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly likeRepo: Repository<CommentLike>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly commentQueryService: CommentQueryService,
  ) {}

  async create(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    await this.ensurePostExists(postId);

    if (dto.parentId) {
      await this.ensureValidParent(postId, dto.parentId);
    }

    const saved = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Comment);
      const comment = repository.create({
        content: dto.content,
        postId,
        userId,
        parentId: dto.parentId ?? null,
      });

      return repository.save(comment);
    });

    return this.commentQueryService.findOne(saved.id, userId);
  }

  async toggleLike(commentId: string, userId: string) {
    const existingLike = await this.likeRepo.findOne({
      where: { commentId, userId },
    });

    let liked: boolean;
    if (existingLike) {
      await this.likeRepo.remove(existingLike);
      liked = false;
    } else {
      const like = this.likeRepo.create({ commentId, userId });
      await this.likeRepo.save(like);
      liked = true;
    }

    // 업데이트된 likeCount 조회
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    return { liked, likeCount: comment?.likeCount ?? 0 };
  }

  async update(
    requesterId: string,
    commentId: string,
    dto: UpdateCommentDto,
    requesterRole: UserRole,
  ) {
    const comment = await this.findById(commentId);

    if (comment.userId !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('수정 권한이 없어요');
    }

    Object.assign(comment, dto);
    comment.contentUpdatedAt = new Date();
    await this.commentRepo.save(comment);

    return this.commentQueryService.findOne(commentId, requesterId);
  }

  async softDelete(
    requesterId: string,
    commentId: string,
    requesterRole: UserRole,
  ) {
    const comment = await this.findById(commentId);

    if (comment.userId !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('삭제 권한이 없어요');
    }

    await this.dataSource.transaction(async (manager) => {
      const commentRepository = manager.getRepository(Comment);
      const postRepository = manager.getRepository(Post);
      const idsToDelete = await this.collectDescendantIds(
        commentRepository,
        comment.id,
      );

      await commentRepository.softDelete(idsToDelete);

      await postRepository.decrement(
        { id: comment.postId },
        'commentCount',
        idsToDelete.length,
      );
    });
  }

  private async collectDescendantIds(
    repository: Repository<Comment>,
    rootCommentId: string,
  ): Promise<string[]> {
    const idsToDelete: string[] = [rootCommentId];
    let frontier: string[] = [rootCommentId];

    while (frontier.length > 0) {
      const children = await repository.find({
        where: { parentId: In(frontier) },
        select: ['id'],
      });

      frontier = children.map((child) => child.id);

      if (frontier.length > 0) {
        idsToDelete.push(...frontier);
      }
    }

    return idsToDelete;
  }

  async findById(id: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'user.avatar'],
    });

    if (!comment) throw new NotFoundException('댓글을 찾을 수 없어요');

    return comment;
  }

  private async ensurePostExists(postId: string) {
    const exists = await this.postRepo.exists({ where: { id: postId } });
    if (!exists) {
      throw new NotFoundException('게시글을 찾을 수 없어요');
    }
  }

  private async ensureValidParent(postId: string, parentId: string) {
    const parent = await this.commentRepo.findOne({
      where: { id: parentId },
      select: ['id', 'postId'],
    });

    if (!parent || parent.postId !== postId) {
      throw new NotFoundException('부모 댓글을 찾을 수 없어요');
    }
  }
}

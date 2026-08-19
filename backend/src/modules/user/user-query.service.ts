import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MyCommentsPageResponseDto,
  UserResponseDto,
} from '@haejoong.com/shared';
import { Comment } from '../comment/entities/comment.entity';
import { User } from './user.entity';
import { UserResponseMapper } from './user-response.mapper';

@Injectable()
export class UserQueryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  async isUserIdAvailable(userId: string) {
    const exists = await this.userRepo.existsBy({ userId });
    return !exists;
  }

  async isNicknameAvailable(nickname: string) {
    const exists = await this.userRepo.existsBy({ nickname });
    return !exists;
  }

  async getMe(id: string): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    return this.userResponseMapper.toUserResponse(user);
  }

  async getMyComments(
    id: string,
    page = 1,
    pageSize = 10,
  ): Promise<MyCommentsPageResponseDto> {
    const safePage = Math.max(1, page);
    const safePageSize = Math.min(50, Math.max(1, pageSize));

    const [comments, total] = await this.commentRepo.findAndCount({
      where: { userId: id },
      relations: ['post'],
      order: { createdAt: 'DESC' },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    });

    return this.userResponseMapper.toMyCommentsPageResponse({
      items: comments.map((comment) =>
        this.userResponseMapper.toUserCommentResponse(comment),
      ),
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.ceil(total / safePageSize),
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({
      relations: ['avatar'],
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.userResponseMapper.toUserResponse(user));
  }

  private async findUserById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['avatar'],
    });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없어요');
    }

    return user;
  }
}

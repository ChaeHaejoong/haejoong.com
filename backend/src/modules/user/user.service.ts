import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  RegisterDto,
  userResponseSchema,
  UserRole,
} from '@haejoong.com/shared';
import { User } from './user.entity';
import { UpdateUserDto } from '@haejoong.com/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ──────────────────────────────────────────────
  // 내부 조회 (AuthService에서 사용)
  // ──────────────────────────────────────────────
  async findById(id: string) {
    return this.findOne({ id });
  }

  async findByUserId(userId: string) {
    return this.findOne({ userId });
  }

  async findByNickname(nickname: string) {
    return this.findOne({ nickname });
  }

  async findByUserIdWithPassword(userId: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  async findByIdWithPassword(id: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(input: RegisterDto) {
    const user = this.userRepo.create(input);
    const saved = await this.userRepo.save(user);
    return userResponseSchema.parse({
      ...saved,
      avatarImageId: saved.avatarImageId ?? null,
      avatarUrl: null,
    });
  }

  // ──────────────────────────────────────────────
  // 공개 CRUD
  // ──────────────────────────────────────────────

  async isUserIdAvailable(userId: string) {
    const exists = await this.userRepo.existsBy({ userId });
    return !exists;
  }

  async isNicknameAvailable(nickname: string) {
    const exists = await this.userRepo.existsBy({ nickname });
    return !exists;
  }

  async update(
    requesterId: string,
    targetId: string,
    dto: UpdateUserDto,
    requesterRole: UserRole,
  ) {
    if (requesterId !== targetId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('수정 권한이 없어요');
    }

    const user = await this.findById(targetId);

    if (dto.nickname && dto.nickname !== user.nickname) {
      const isAvailable = await this.isNicknameAvailable(dto.nickname);
      if (!isAvailable) {
        throw new ConflictException('이미 사용 중인 닉네임이에요');
      }
      user.nickname = dto.nickname;
    }

    if (dto.nickname) {
      user.nickname = dto.nickname;
    }

    if (dto.avatarImageId === null) {
      user.avatarImageId = null;
      user.avatar = null;
    } else if (dto.avatarImageId) {
      user.avatarImageId = dto.avatarImageId;
      user.avatar = null;
    }

    await this.userRepo.save(user);

    const updated = await this.findById(targetId);
    return this.toUserResponse(updated);
  }

  async softDelete(
    requesterId: string,
    targetId: string,
    requesterRole: UserRole,
  ) {
    // 본인 또는 Admin만 삭제 가능
    if (requesterId !== targetId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('삭제 권한이 없어요');
    }

    await this.findById(targetId);
    await this.userRepo.softDelete(targetId);
  }

  // =====================================
  // private functions
  // =====================================

  private toUserResponse(user: User) {
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

  private async findOne(where: FindOptionsWhere<User>) {
    const user = await this.userRepo.findOne({
      where,
      relations: ['avatar'],
    });

    if (!user) throw new NotFoundException('유저를 찾을 수 없어요');

    return user;
  }
}

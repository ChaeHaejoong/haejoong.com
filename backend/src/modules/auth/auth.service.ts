import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { UserService } from '../user/user.service.js';
import { LoginDto, RegisterDto } from '@haejoong.com/shared';
import { JwtPayload } from './strategies/jwt-access.strategy.js';
import { User } from '../user/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity.js';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly REFRESH_TOKEN_TTL_DAYS = 30;
  private readonly REFRESH_GRACE_PERIOD_MS: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
  ) {
    this.REFRESH_GRACE_PERIOD_MS = this.parseRefreshGracePeriodMs();
  }

  async register(dto: RegisterDto): Promise<void> {
    const [isUserIdAvailable, isNicknameAvailable] = await Promise.all([
      this.userService.isUserIdAvailable(dto.userId),
      this.userService.isNicknameAvailable(dto.nickname),
    ]);

    if (!isUserIdAvailable)
      throw new ConflictException('이미 사용 중인 아이디예요');

    if (!isNicknameAvailable)
      throw new ConflictException('이미 사용 중인 닉네임이어요');

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    await this.userService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByUserIdWithPassword(dto.userId);

    if (!user)
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않아요');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않아요');

    // Keep other device sessions intact; only prune definitely expired rows.
    await this.refreshRepo.delete({
      userId: user.id,
      expiresAt: LessThan(new Date()),
    });

    return this.generateTokens(user);
  }

  async removeRefreshToken(token: string) {
    if (!token) {
      return;
    }

    await this.refreshRepo.delete({ tokenHash: this.hashToken(token) });
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await this.refreshRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('유효하지 않은 토큰이어요');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.refreshRepo.delete({ id: storedToken.id });
      throw new UnauthorizedException('토큰 사용 기간이 만료되었어요');
    }

    // Allow a short grace window for near-simultaneous refresh requests.
    if (storedToken.usedAt) {
      const now = new Date().getTime();
      const usedTime = storedToken.usedAt.getTime();

      if (now - usedTime < this.REFRESH_GRACE_PERIOD_MS) {
        return this.generateTokens(storedToken.user, storedToken.familyId);
      }

      throw new UnauthorizedException('이미 사용된 토큰이어요');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('이미 폐기된 토큰이어요');
    }

    const user = storedToken.user;

    await this.refreshRepo.update(storedToken.id, {
      usedAt: new Date(),
      revokedAt: new Date(),
    });

    return this.generateTokens(user, storedToken.familyId);
  }

  async verifyPassword(userId: string, password: string) {
    const user = await this.userService.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException('유저를 찾을 수 없어요');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 올바르지 않아요');
    }

    return { verified: true };
  }

  private async generateTokens(user: User, familyId?: string) {
    const refreshTokenFamilyId = familyId ?? randomUUID();

    const payload: JwtPayload = {
      sub: user.id,
      userId: user.userId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
      // Prevent identical token issuance under concurrent refresh requests.
      jwtid: randomUUID(),
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_TTL_DAYS);

    await this.refreshRepo.save({
      userId: user.id,
      user,
      tokenHash: this.hashToken(refreshToken),
      familyId: refreshTokenFamilyId,
      usedAt: null,
      revokedAt: null,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseRefreshGracePeriodMs() {
    const configured = Number(
      this.configService.get('REFRESH_REUSE_GRACE_MS') ?? 60_000,
    );

    if (!Number.isFinite(configured) || configured <= 0) {
      return 60_000;
    }

    return Math.floor(configured);
  }
}

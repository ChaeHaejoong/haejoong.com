import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto, LoginDto, VerifyPasswordDto } from './auth.dto.js';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard.js';
import { JwtAccessGuard } from './guards/jwt-access.guard.js';
import { Cookie } from '../../common/decorators/cookie.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { Response } from 'express';

const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const resolveRefreshCookieSameSite = (): 'strict' | 'lax' | 'none' => {
  const configured =
    process.env.REFRESH_TOKEN_COOKIE_SAMESITE?.trim().toLowerCase();

  if (
    configured === 'strict' ||
    configured === 'lax' ||
    configured === 'none'
  ) {
    return configured;
  }

  return process.env.NODE_ENV === 'production' ? 'none' : 'lax';
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: resolveRefreshCookieSameSite(),
  path: '/',
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);
    return { message: '회원가입이 완료되었습니다' };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);

    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Cookie('refreshToken') refreshToken: string,
  ) {
    await this.authService.removeRefreshToken(refreshToken);

    res.clearCookie('refreshToken', REFRESH_TOKEN_COOKIE_OPTIONS);

    return { message: '로그아웃 됐어요' };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Cookie('refreshToken') refreshToken: string,
  ) {
    const tokens = await this.authService.refresh(refreshToken);

    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('verify-password')
  @UseGuards(JwtAccessGuard)
  async verifyPassword(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPasswordDto,
  ) {
    return this.authService.verifyPassword(userId, dto.password);
  }
}

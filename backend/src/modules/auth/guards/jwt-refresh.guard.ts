import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      const message =
        info?.name === 'TokenExpiredError'
          ? '세션이 만료되었어요. 다시 로그인해 주세요'
          : '유효하지 않은 세션이에요. 다시 로그인해 주세요';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}

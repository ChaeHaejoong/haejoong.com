import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      const message =
        info?.name === 'TokenExpiredError'
          ? '로그인 세션이 만료되었어요. 다시 로그인해 주세요'
          : '로그인이 필요해요';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}

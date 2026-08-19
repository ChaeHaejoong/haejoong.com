import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessOptionalGuard extends AuthGuard('jwt-access') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: any,
    _status?: any,
  ): TUser {
    if (err || !user) {
      return null as TUser;
    }

    return user as TUser;
  }
}

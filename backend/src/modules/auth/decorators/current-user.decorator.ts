import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '@haejoong.com/shared';

export type CurrentUserPayload = {
  id: string;
  userId: string;
  role: UserRole;
};

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUserPayload;

    if (!data) return user;

    return user?.[data];
  },
);

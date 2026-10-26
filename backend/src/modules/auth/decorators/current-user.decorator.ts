import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@haejoong.com/shared';

export type CurrentUserPayload = {
  id: string;
  userId: string;
  role: UserRole;
};

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext) => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<{ user: CurrentUserPayload }>();

    if (!data) return user;

    return user?.[data];
  },
);

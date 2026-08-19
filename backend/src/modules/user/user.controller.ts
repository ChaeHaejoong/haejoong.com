import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserRole } from '@haejoong.com/shared';
import { UserService } from './user.service.js';
import { UserQueryService } from './user-query.service.js';
import { UpdateUserDto } from './user.dto.js';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userQueryService: UserQueryService,
  ) {}

  @Get('check-userid')
  async checkUserId(@Query('userId') userId: string) {
    return {
      available: await this.userQueryService.isUserIdAvailable(userId),
    };
  }

  @Get('check-nickname')
  async checkNickname(@Query('nickname') nickname: string) {
    return {
      available: await this.userQueryService.isNicknameAvailable(nickname),
    };
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  async getMe(@CurrentUser('id') id: string) {
    return this.userQueryService.getMe(id);
  }

  @Get('me/comments')
  @UseGuards(JwtAccessGuard)
  async getMyComments(
    @CurrentUser('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {
    return this.userQueryService.getMyComments(id, page, pageSize);
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.userQueryService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id', ParseUUIDPipe) targetId: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.userService.update(requesterId, targetId, dto, role);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  @HttpCode(204)
  async remove(
    @Param('id', ParseUUIDPipe) targetId: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    await this.userService.softDelete(requesterId, targetId, role);
  }
}

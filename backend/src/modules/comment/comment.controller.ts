import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UserRole } from '@haejoong.com/shared';
import { CommentService } from './comment.service';
import { CommentQueryService } from './comment-query.service';
import type { CreateCommentDto, UpdateCommentDto } from '@haejoong.com/shared';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { JwtAccessOptionalGuard } from '../auth/guards/jwt-access-optional.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentQueryService: CommentQueryService,
  ) {}

  @Post('posts/:postId')
  @UseGuards(JwtAccessGuard)
  async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentService.create(postId, userId, dto);
  }

  @Get('posts/:postId')
  @UseGuards(JwtAccessOptionalGuard)
  async findAllByPostId(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.commentQueryService.findAllByPostId(postId, userId);
  }

  @Post(':id/like')
  @UseGuards(JwtAccessGuard)
  async toggleLike(
    @Param('id', ParseUUIDPipe) commentId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentService.toggleLike(commentId, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.commentService.update(requesterId, commentId, dto, role);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  @HttpCode(204)
  async remove(
    @Param('id', ParseUUIDPipe) commentId: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    await this.commentService.softDelete(requesterId, commentId, role);
  }
}

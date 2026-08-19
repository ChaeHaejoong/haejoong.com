import {
  Controller,
  Get,
  Post as HttpPost,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { PostService } from './post.service';
import { PostQueryService } from './post-query.service';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { UserRole } from '@haejoong.com/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { JwtAccessOptionalGuard } from '../auth/guards/jwt-access-optional.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { ViewCountService } from './view-count.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postQueryService: PostQueryService,
    private readonly viewCountService: ViewCountService,
  ) {}

  @Get('published')
  @UseGuards(JwtAccessOptionalGuard)
  async getPublished(@CurrentUser('id') userId?: string) {
    const [posts, buffer] = await Promise.all([
      this.postQueryService.findPublished(userId),
      this.viewCountService.getAllBufferedCounts(),
    ]);
    return posts.map((post) => ({
      ...post,
      views: post.views + (buffer[post.id] ?? 0),
    }));
  }

  @Get('drafted')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getDrafts(@CurrentUser('id') userId: string) {
    const [posts, buffer] = await Promise.all([
      this.postQueryService.findDrafts(userId),
      this.viewCountService.getAllBufferedCounts(),
    ]);
    return posts.map((post) => ({
      ...post,
      views: post.views + (buffer[post.id] ?? 0),
    }));
  }

  @Get(':id')
  @UseGuards(JwtAccessOptionalGuard)
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser?: CurrentUserPayload,
  ) {
    const [post, buffered] = await Promise.all([
      this.postQueryService.findOne(id, currentUser),
      this.viewCountService.getBufferedCount(id),
    ]);

    return { ...post, views: post.views + buffered };
  }

  @HttpPost(':id/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessOptionalGuard)
  async recordView(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string | undefined,
    @Req() req: Request,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ??
      req.ip ??
      '';
    await this.viewCountService.record(id, userId, ip);
  }

  @HttpPost(':id/like')
  @UseGuards(JwtAccessGuard)
  toggleLike(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.postService.toggleLike(id, userId);
  }

  @HttpPost()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@CurrentUser('id') authorId: string, @Body() body: CreatePostDto) {
    return this.postService.create(authorId, body);
  }

  @Put(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdatePostDto) {
    return this.postService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.postService.remove(id);
  }
}

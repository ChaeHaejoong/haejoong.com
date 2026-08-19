import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { TagQueryService } from './tag-query.service';
import { CreateTagDto } from './tag.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@haejoong.com/shared';

@Controller('tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly tagQueryService: TagQueryService,
  ) {}

  @Get()
  findAll() {
    return this.tagQueryService.findAll();
  }

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagService.remove(id);
  }
}

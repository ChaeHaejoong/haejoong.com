import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageQueryService } from './image-query.service';
import { ImageMapper } from './image.mapper';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ImageSummaryDto, UploadImageResponseDto } from './image.dto';

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly imageQueryService: ImageQueryService,
    private readonly imageMapper: ImageMapper,
  ) {}

  @Get('mine')
  @UseGuards(JwtAccessGuard)
  async findMine(
    @CurrentUser('id') userId: string,
  ): Promise<ImageSummaryDto[]> {
    return this.imageQueryService.findMine(userId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAccessGuard)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
  ): Promise<UploadImageResponseDto> {
    const image = await this.imageService.create(file, userId);
    return this.imageMapper.toUploadResponse(image);
  }
}

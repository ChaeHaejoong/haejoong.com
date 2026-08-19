import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageSummaryDto } from '@haejoong.com/shared';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { ImageMapper } from './image.mapper';

@Injectable()
export class ImageQueryService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly imageMapper: ImageMapper,
  ) {}

  async findMine(userId: string): Promise<ImageSummaryDto[]> {
    const images = await this.imageRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return images.map((image) => this.imageMapper.toSummary(image));
  }
}

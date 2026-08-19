import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { extname } from 'path';
import type { IStorage } from '../../infrastructure/storage/storage.interface';
import { STORAGE } from '../../infrastructure/storage/storage.module';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @Inject(STORAGE)
    private readonly storage: IStorage,
  ) {}

  async create(file: Express.Multer.File, userId: string) {
    const url = await this.storage.uploadFile(file);

    const normalizedFilename = Buffer.from(
      file.originalname,
      'latin1',
    ).toString('utf8');
    const filenameWithoutExt = normalizedFilename.replace(
      extname(normalizedFilename),
      '',
    );
    const safeFilename = filenameWithoutExt.normalize('NFC');

    const image = this.imageRepository.create({
      url,
      path: url,
      filename: safeFilename,
      mimeType: file.mimetype,
      size: file.size,
      userId,
    });

    return this.imageRepository.save(image);
  }
}

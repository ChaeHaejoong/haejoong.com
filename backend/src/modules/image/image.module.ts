import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StorageModule } from '../../infrastructure/storage/storage.module';
import { ImageQueryService } from './image-query.service';
import { ImageMapper } from './image.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    StorageModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageQueryService, ImageMapper],
})
export class ImageModule {}

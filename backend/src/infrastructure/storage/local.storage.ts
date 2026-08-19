import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { IStorage } from './storage.interface';

@Injectable()
export class LocalStorage implements IStorage, OnModuleInit {
  private readonly uploadDir: string;
  private readonly uploadPublicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = config.get<string>(
      'UPLOAD_DIR',
      join(process.cwd(), 'uploads'),
    );
    this.uploadPublicBaseUrl = (
      config.get<string>('UPLOAD_PUBLIC_BASE_URL') ?? ''
    ).replace(/\/+$/, '');
  }

  async onModuleInit() {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const filename = `${randomUUID()}${ext}`;
      const filePath = join(this.uploadDir, filename);
      await fs.writeFile(filePath, file.buffer);
      return this.getFileUrl(filename);
    } catch {
      throw new InternalServerErrorException('파일 저장에 실패했어요');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filename = fileUrl.replace(/^\/uploads\//, '');
      await fs.unlink(join(this.uploadDir, filename));
    } catch {
      // 파일이 없어도 무시
    }
  }

  getFileUrl(filename: string): string {
    const relativePath = `/uploads/${filename}`;
    if (!this.uploadPublicBaseUrl) {
      return relativePath;
    }

    return `${this.uploadPublicBaseUrl}${relativePath}`;
  }
}

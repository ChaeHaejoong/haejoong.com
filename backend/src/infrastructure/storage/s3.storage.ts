import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { IStorage } from './storage.interface';

@Injectable()
export class S3Storage implements IStorage, OnModuleInit {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = config.get<string>('S3_BUCKET', 'images');
    const endpoint = config.get<string>(
      'S3_ENDPOINT',
      'http://localstack:4566',
    );
    this.publicUrl = config.get<string>(
      'S3_PUBLIC_URL',
      'http://localhost:4566',
    );

    this.client = new S3Client({
      region: config.get<string>('AWS_REGION', 'us-east-1'),
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', 'test'),
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY', 'test'),
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = extname(file.originalname);
    const key = `${randomUUID()}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return this.getFileUrl(key);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // TODO: S3 연동 시 구현
    // const key = fileUrl.replace(`${this.publicUrl}/${this.bucket}/`, '');
    // await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    void DeleteObjectCommand;
  }

  getFileUrl(key: string): string {
    return `${this.publicUrl}/${this.bucket}/${key}`;
  }
}


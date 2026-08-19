import { Module } from '@nestjs/common';
import { LocalStorage } from './local.storage';
import { S3Storage } from './s3.storage';
import type { IStorage } from './storage.interface';

export const STORAGE = 'STORAGE';

const storageClass =
  process.env.STORAGE_TYPE === 's3' ? S3Storage : LocalStorage;

@Module({
  providers: [
    {
      provide: STORAGE,
      useClass: storageClass as new (...args: unknown[]) => IStorage,
    },
  ],
  exports: [STORAGE],
})
export class StorageModule {}

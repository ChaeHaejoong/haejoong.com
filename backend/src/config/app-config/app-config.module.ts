import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const candidateEnvPaths = [
  resolve(process.cwd(), `.env.${NODE_ENV}.local`),
  resolve(process.cwd(), `.env.${NODE_ENV}`),
  resolve(process.cwd(), '.env.local'),
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '..', `.env.${NODE_ENV}.local`),
  resolve(process.cwd(), '..', `.env.${NODE_ENV}`),
  resolve(process.cwd(), '..', '.env.local'),
  resolve(process.cwd(), '..', '.env'),
];

const envFilePath = candidateEnvPaths.filter((path) => existsSync(path));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
  ],
})
export class AppConfigModule {}

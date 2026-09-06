import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';

const envFilePath = resolve(process.cwd(), "..", '.env.dev');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
  ],
})
export class AppConfigModule {}

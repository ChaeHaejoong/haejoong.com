import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const uploadDir = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');
const frontendDistDir =
  process.env.FRONTEND_DIST_DIR ?? join(process.cwd(), 'public');

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: uploadDir,
        serveRoot: '/uploads',
      },
      {
        rootPath: frontendDistDir,
        exclude: ['/api', '/api/*path', '/uploads', '/uploads/*path'],
      },
    ),
  ],
})
export class StaticModule {}

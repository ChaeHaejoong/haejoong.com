import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = process.env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (corsOrigins?.length) {
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
    });
  }

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ZodValidationPipe());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

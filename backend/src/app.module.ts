import { Module } from '@nestjs/common';
import { DbModule } from './infrastructure/db/db.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { StaticModule } from './infrastructure/static/static.module';
import { AppConfigModule } from './config/app-config/app-config.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { TagModule } from './modules/tag/tag.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DbModule,
    UserModule,
    AuthModule,
    ImageModule,
    StaticModule,
    AppConfigModule,
    PostModule,
    CommentModule,
    TagModule,
    RedisModule,
    ScheduleModule.forRoot(),
  ]
})
export class AppModule {}

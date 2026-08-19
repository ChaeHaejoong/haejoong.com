import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Comment } from '../comment/entities/comment.entity';
import { UserQueryService } from './user-query.service';
import { UserResponseMapper } from './user-response.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment])],
  providers: [UserService, UserQueryService, UserResponseMapper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

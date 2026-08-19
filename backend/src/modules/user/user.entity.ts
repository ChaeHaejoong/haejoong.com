import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RefreshToken } from '../auth/refresh-token.entity.js';
import { UserRole } from '@haejoong.com/shared';
import { Image } from '../image/image.entity.js';
import { Comment } from '../comment/entities/comment.entity.js';
import { CommentLike } from '../comment/entities/comment-like.entity.js';
import { Post } from '../post/entities/post.entity.js';
import { PostLike } from '../post/entities/post-like.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  password: string;

  @Column({ type: 'uuid', nullable: true })
  avatarImageId: string | null;

  @OneToOne(() => Image, (image) => image.avatarOf, { nullable: true })
  @JoinColumn({ name: 'avatarImageId' })
  avatar: Image | null;

  @Column({ unique: true })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ default: null })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Image, (image) => image.uploader)
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => CommentLike, (like) => like.user)
  commentLikes: CommentLike[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => PostLike, (like) => like.user)
  postLikes: PostLike[];
}

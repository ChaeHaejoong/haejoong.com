import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { PostLike } from './post-like.entity';
import { User } from '../../user/user.entity';
import { PostTag } from './post-tag.entity';

@Entity('posts')
@Index('ix_posts_author_id_created_at', ['authorId', 'createdAt'])
@Index('ix_posts_published_created_at', ['published', 'createdAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar' })
  thumbnail: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  contentUpdatedAt: Date | null;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];
}

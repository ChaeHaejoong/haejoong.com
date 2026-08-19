import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../../user/user.entity';

@Entity('comment_likes')
@Index('ux_comment_likes_comment_id_user_id', ['commentId', 'userId'], {
  unique: true,
})
@Index('ix_comment_likes_user_id_created_at', ['userId', 'createdAt'])
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  commentId: string;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.commentLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

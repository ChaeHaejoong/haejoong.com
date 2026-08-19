import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Tag } from '../../tag/tag.entity';

@Entity('post_tags')
@Index('ux_post_tags_post_id_tag_id', ['postId', 'tagId'], { unique: true })
@Index('ix_post_tags_tag_id_post_id', ['tagId', 'postId'])
export class PostTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  tagId: string;

  @ManyToOne(() => Post, (post) => post.postTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @CreateDateColumn()
  createdAt: Date;
}

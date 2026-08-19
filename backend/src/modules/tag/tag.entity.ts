import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTag } from '../post/entities/post-tag.entity';

@Entity('tags')
@Index('ux_tags_name', ['name'], { unique: true })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}

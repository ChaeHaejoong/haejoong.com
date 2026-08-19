import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.images)
  @JoinColumn({ name: 'userId' })
  uploader: User;

  @OneToOne(() => User, (user) => user.avatar)
  avatarOf: User;

  @CreateDateColumn()
  createdAt: Date;
}

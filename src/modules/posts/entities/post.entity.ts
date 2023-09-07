import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';
import BaseEntity from '@/lib/entities/base/base.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, (author: User) => author.id, {
    cascade: ['insert'],
    eager: true,
  })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' })
  author: User;

  @Column({ name: 'authorId', nullable: false, select: false })
  authorId: string;
}

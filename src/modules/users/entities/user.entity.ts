import BaseEntity from '@/lib/entities/base/base.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Post, (post) => post.author, {
    cascade: true,
  })
  posts: Post[];
}

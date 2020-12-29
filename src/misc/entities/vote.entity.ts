import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from 'src/post/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import User from 'src/user/entities/user.entity';
import Entity from '../../utils/base.entity';

@TOEntity('votes')
export class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  //ManyToOne valojaban egy foreign key
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}

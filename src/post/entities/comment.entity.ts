import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Entity from '../../utils/base.entity';
import User from '../../user/entities/user.entity';
import { makeId } from '../../utils/helpers';
import { Post } from './post.entity';
import { Vote } from 'src/misc/entities/vote.entity';

@TOEntity('comments')
export class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  // user who created the comment
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  // post where comment have been created
  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  // JoinColumn not needed if I want to join them by id. That is the default
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  protected userVote: number;

  setUserVote(user: User) {
    if (this.votes) {
      const index = this.votes.findIndex((v) => v.username === user.username);
      this.userVote = index > -1 ? this.votes[index].value : 0;
    }
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}

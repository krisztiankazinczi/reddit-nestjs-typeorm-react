import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  OneToMany,
} from 'typeorm';
import Entity from '../../utils/base.entity';
import User from '../../user/entities/user.entity';
import { makeId, slugify } from '../../utils/helpers';
import { Sub } from '../../sub/entities/sub.entity';
import { Comment } from './comment.entity';
import { Exclude } from 'class-transformer';
import { Vote } from 'src/misc/entities/vote.entity';

@TOEntity('posts')
export class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 character id

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' }) // this will create a username column here!!!
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts) // many posts can go in 1 Sub
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude() // with this we won't send back to user the votes, but the votescrore yes
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  // If we want to send extra fields to client, use this:

  // @Expose() get url(): string {
  //   return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  // }

  // @Expose() get commentCount(): number {
  //     return this.comments?.length
  // }

  // @Expose() get voteScore(): number {
  //   return this.votes?.reduce((prev, curr) => prev + (curr.value || 0 ), 0);
  // }

  // this equals with the Expose solution!!!!
  protected url: string;
  protected commentCount: number;
  protected voteScore: number;
  protected userVote: number;

  // az ilyen random functionoket meglehet majd hivni a controllerben!!!!
  setUserVote(user: User) {
    if (this.votes) {
      const index = this.votes.findIndex((v) => v.username === user.username);
      this.userVote = index > -1 ? this.votes[index].value : 0;
    }
  }

  @AfterLoad()
  createFields() {
    this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;

    if (this.comments) {
      this.commentCount = this.comments.length;
    }

    if (this.votes) {
      this.voteScore = this.votes.reduce(
        (prev, curr) => prev + (curr.value || 0),
        0,
      );
    }
  }

  //this is how we can add values to columns without asking from the user
  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}

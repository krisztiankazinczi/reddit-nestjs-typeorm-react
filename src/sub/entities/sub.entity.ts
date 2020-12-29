import { Length } from 'class-validator';
import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Entity from '../../utils/base.entity';
import User from '../../user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Expose } from 'class-transformer';

@TOEntity('subs')
export class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Length(5, 255, { message: 'Must be at least 5 characters long' })
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  // create urls from urn. Only when we try to find these elements!!!
  // but here in this repository pattern, I have to call these methods from controller
  // in this repository pattern these arent calledd automatically, so I just create a function
  // @Expose()/images/hoHIKGfeW8t9aad.png

  protected imageUrl: string;
  protected bannerUrl: string | undefined;

  getUrls() {
    this.imageUrl = this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

    this.bannerUrl = this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }
}

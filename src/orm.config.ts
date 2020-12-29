import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Sub } from './sub/entities/sub.entity';
import { Post } from './post/entities/post.entity';
import User from './user/entities/user.entity';
import { Comment } from './post/entities/comment.entity';
import { Vote } from './misc/entities/vote.entity';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'lilkrisz',
  password: 'root',
  // password: process.env.DATABASE_PASSWORD,
  database: 'nestjs',
  synchronize: true, // with this the schema will be updated always
  logging: true,
  // entities: ['dist/**/*.entity{.ts,.js}'],
  entities: [User, Sub, Post, Comment, Vote],
};

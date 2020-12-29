import { IsNotEmpty } from 'class-validator';
import User from 'src/user/entities/user.entity';
import { Post } from '../entities/post.entity';

export class CreateCommentDto {
  @IsNotEmpty()
  body: string;

  user?: User;

  post?: Post;
}

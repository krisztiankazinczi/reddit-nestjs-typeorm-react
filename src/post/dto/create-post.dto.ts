import { IsNotEmpty } from 'class-validator';
import { Sub } from 'src/sub/entities/sub.entity';
import User from 'src/user/entities/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  subName: string;

  body?: string;
  // these properties will be added in controller!!!
  user?: User;

  sub: Sub;
}

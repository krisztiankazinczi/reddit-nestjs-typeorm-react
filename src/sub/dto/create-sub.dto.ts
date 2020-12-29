import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import User from 'src/user/entities/user.entity';

export class CreateSubDto {
  @IsNotEmpty()
  @MinLength(3, {
    message: 'name is too short',
  })
  @MaxLength(30, {
    message: 'name is too long',
  })
  name: string;

  @IsNotEmpty()
  @MinLength(3, {
    message: 'title is too short',
  })
  title: string;

  description: string;
  user?: User;
}

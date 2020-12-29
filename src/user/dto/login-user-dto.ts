import { Length } from 'class-validator';

export class LoginUserDto {
  @Length(3, 255, { message: 'username must be at least 3 characters long' })
  username: string;

  @Length(6, 255, { message: 'password must be at least 6 characters long' })
  password: string;
}

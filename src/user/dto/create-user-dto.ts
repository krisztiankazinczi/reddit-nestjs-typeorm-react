import { Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @Length(1, 255, { message: 'email is empty' })
  @IsEmail(undefined, { message: 'email must be a valid email address' })
  email: string;

  @Length(3, 255, { message: 'username must be at least 3 characters long' })
  username: string;

  @Length(6, 255, { message: 'password must be at least 6 characters long' })
  password: string;
}

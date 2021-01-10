import { Body, Controller, Get, Post, Res, Param } from '@nestjs/common';
import { validate } from 'class-validator';
import { UserService } from './user.service';
import { mapErrors } from '../utils/helpers';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { usernameOrEmailExists } from './validation/register.validation';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  test() {
    return 'It is working properly';
  }

  @Post('register')
  async register(@Body() body: CreateUserDto, @Res() res) {
    const { email, username, password } = body;

    try {
      // * Validate
      let errors: any = {};

      errors = await usernameOrEmailExists(
        username,
        email,
        this.userService,
        errors,
      );

      if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
      }
      // * create User
      const user = this.userService.createUser(email, username, password);
      // * Validate with Entity validation rules

      errors = await validate(user);

      if (errors.length) {
        return res.status(400).json(mapErrors(errors));
      }
      await this.userService.register(user);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: 'Something went wrong. Please try again later.' });
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res) {
    // const { username, password } = body;
    console.log('login meghivodik');
    try {
      const user = await this.userService.findByUsername(loginUserDto.username);
      if (!user) {
        return res.status(404).json({ username: 'User not found' });
      }
      const passwordMatches = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!passwordMatches) {
        return res.status(401).json({ password: 'Password is incorrect' });
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = jwt.sign(
        { username: loginUserDto.username },
        process.env.JWT_SECRET!,
      );

      res.set(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true, // can not inject javascript into the cookie!!!!
          secure: process.env.NODE_ENV === 'production', // only https connection if that is true
          sameSite: 'strict',
          maxAge: 3600, // cookie valid for 1h
          path: '/', // tis cookie will be valid through the whole page. If it's more detailed the cookie will be valid only in that paths
        }),
      );

      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  @Get('me')
  me(@Res() res) {
    return res.json(res.locals.user);
  }

  @Get('logout')
  logout(@Res() res) {
    res.set(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // immediately expires
        path: '/',
      }),
    );

    res.status(200).json({ success: true });
  }

  @Get('users')
  async findAll() {
    return await this.userService.findAll();
  }
}

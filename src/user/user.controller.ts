import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Param,
  UploadedFile,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { validate } from 'class-validator';
import { UserService } from './user.service';
import { makeId, mapErrors } from '../utils/helpers';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { usernameOrEmailExists } from './validation/register.validation';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import User from './entities/user.entity';

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

  @Get('demo-login')
  async demoLogin(@Res() res) {
    try {
      const user = await this.userService.findByUsername('demo');
      if (!user) {
        return res.status(404).json({ username: 'User not found' });
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = jwt.sign({ username: 'demo' }, process.env.JWT_SECRET!);

      res.set(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600,
          path: '/',
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

  @Post(':username/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, callback) => {
          // this code generates a random filename
          const name = makeId(15);
          callback(null, name + path.extname(file.originalname)); //random string + file extension
        },
      }),
      // this middleware will check the type of uploaded files!!!
      fileFilter: (
        req,
        file: any,
        callback: (error: Error, acceptFile: boolean) => void,
      ) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          callback(null, true);
        } else {
          req.fileValidationError = 'Unsupported file type';
          // I don't throw new error here. I will handle this in controller function
          callback(null, false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Req() req,
    @Res() res,
    @Param() params,
  ) {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    const { username } = params;

    const user: User = await this.userService.findByUsername(username);

    if (user.username !== res.locals.user.username) {
      fs.unlinkSync(`public/images/${file.filename}`);
      return res.status(403).json({ error: 'It is not your account' });
    }

    if (user.username)
      try {
        let oldImageUrn = '';
        oldImageUrn = user.imageUrn || '';
        user.imageUrn = file.filename;

        // if we upload a new image, just delete the previous one
        await this.userService.save(user);

        if (oldImageUrn !== '') {
          fs.unlinkSync(`public/images/${oldImageUrn}`);
        }

        return res.json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
      }

    return res.status(200).json({ success: true });
  }
}

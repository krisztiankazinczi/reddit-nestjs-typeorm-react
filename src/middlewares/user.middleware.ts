import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/entities/user.entity';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // with cookie-parser we can get the cookie values from req.cookies
      const token = req.cookies.token;
      if (!token) {
        return next();
      }
      // username was added in the jwt token during creation
      const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);
      // needed ! because typescript don't if that exists or not. with !mark we can tell typescript to abandon that

      const user = await User.findOne({ username });
      // in express this is suggested to store user data in res.locals not just res.user
      res.locals.user = user;

      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'Unauthenticated' });
    }
  }
}

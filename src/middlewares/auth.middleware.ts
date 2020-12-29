import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import User from '../user/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User | undefined = res.locals.user;
      if (!user) throw new Error('Unauthenticated');

      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'Unauthenticated' });
    }
  }
}

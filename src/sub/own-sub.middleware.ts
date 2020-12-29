import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import User from '../user/entities/user.entity';
import { Sub } from './entities/sub.entity';

@Injectable()
export class OwnSubMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // itt mar atmentunk az authentication middlewaren, szoval ez letezik
    const user: User = res.locals.user;
    try {
      const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });
      console.log(sub);
      if (sub.username !== user.username) {
        return res.status(403).json({ error: 'You dont own this sub' });
      }
      res.locals.sub = sub;
      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

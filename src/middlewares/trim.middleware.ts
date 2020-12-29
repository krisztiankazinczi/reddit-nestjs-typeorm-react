import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// export function trimmer(req: Request, res: Response, next: NextFunction) {
//   const exceptions = ['password'];
//   console.log(req.body);
//   Object.keys(req.body).forEach((key) => {
//     if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
//       req.body[key] = req.body[key].trim();
//     }
//   });
//   next();
// }

@Injectable()
export class TrimMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const exceptions = ['password'];
    Object.keys(req.body).forEach((key) => {
      if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
    next();
  }
}

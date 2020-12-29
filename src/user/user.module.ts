import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import User from './entities/user.entity';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes(
        { path: 'api/me', method: RequestMethod.GET },
        { path: 'api/users', method: RequestMethod.GET },
        { path: 'api/logout', method: RequestMethod.GET },
      );
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/me', method: RequestMethod.GET },
        { path: 'api/users', method: RequestMethod.GET },
        { path: 'api/logout', method: RequestMethod.GET },
      );
  }
}

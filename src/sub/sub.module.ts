import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { SubService } from './sub.service';
import { SubController } from './sub.controller';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub } from './entities/sub.entity';
import { PostModule } from 'src/post/post.module';
import { OwnSubMiddleware } from './own-sub.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Sub]), forwardRef(() => PostModule)],
  exports: [SubService],
  controllers: [SubController],
  providers: [SubService],
})
export class SubModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: 'api/subs', method: RequestMethod.ALL });
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'api/subs/:name', method: RequestMethod.GET })
      .forRoutes({ path: 'api/subs', method: RequestMethod.ALL });
    consumer
      .apply(OwnSubMiddleware)
      .forRoutes({ path: 'api/subs/:name/image', method: RequestMethod.POST });
  }
}

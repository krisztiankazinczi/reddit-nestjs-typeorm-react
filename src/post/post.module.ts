import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { SubModule } from 'src/sub/sub.module';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    forwardRef(() => SubModule),
  ],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(
      { path: 'api/posts', method: RequestMethod.POST },
      { path: 'api/posts', method: RequestMethod.GET },
      { path: 'api/posts/:identifier/:slug', method: RequestMethod.GET },
      {
        path: 'api/posts/:identifier/:slug/comments',
        method: RequestMethod.POST,
      },
    );
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'api/posts', method: RequestMethod.POST },
      {
        path: 'api/posts/:identifier/:slug/comments',
        method: RequestMethod.POST,
      },
    );
  }
}

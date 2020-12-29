import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MiscService } from './misc.service';
import { MiscController } from './misc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PostModule],
  controllers: [MiscController],
  providers: [MiscService],
})
export class MiscModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: 'api/misc/vote', method: RequestMethod.POST });
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/misc/vote', method: RequestMethod.POST });
  }
}

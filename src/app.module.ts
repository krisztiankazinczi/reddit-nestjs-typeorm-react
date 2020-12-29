import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TrimMiddleware } from './middlewares/trim.middleware';
import { SubModule } from './sub/sub.module';
import { PostModule } from './post/post.module';
import { MiscModule } from './misc/misc.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({
      // every files will have access to .env file
      isGlobal: true,
    }),
    UserModule,
    SubModule,
    PostModule,
    MiscModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TrimMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

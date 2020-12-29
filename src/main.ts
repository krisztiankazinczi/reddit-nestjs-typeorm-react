import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './validation-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.setGlobalPrefix('api')
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(new ValidationPipe());
  // this filter catch the badrequestexceptions and create a formed error object
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(process.env.PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, '../public/images'), {
    prefix: '/images', 
  });

  app.enableCors(); 

  await app.listen(process.env.PORT);
  console.log(`API Gateway is running on Port: ${process.env.PORT}`);
}
bootstrap();

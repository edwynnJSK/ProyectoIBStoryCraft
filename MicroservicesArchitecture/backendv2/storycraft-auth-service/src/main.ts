import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  await app.listen(process.env.PORT);
  console.log(`Auth Service is running on Port: ${process.env.PORT}`);
}
bootstrap();

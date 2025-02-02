import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, '../public/images'), {
    prefix: '/images',
  });

  // Aplica un ValidationPipe global para validar y transformar los datos de entrada.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs.
      forbidNonWhitelisted: true, // Rechaza solicitudes con propiedades no permitidas.
      transform: true, // Transforma automáticamente los datos a los tipos especificados en los DTOs.
      transformOptions: {
        enableImplicitConversion: true, // Habilita la conversión implícita de tipos.
      },
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT);
  console.log(`API Gateway is running on Port: ${process.env.PORT}`);
}
bootstrap();

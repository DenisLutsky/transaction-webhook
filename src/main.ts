import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import config from 'configs/app.config';
import { AppModule } from './app.module';

(async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(config.app.port);
})();

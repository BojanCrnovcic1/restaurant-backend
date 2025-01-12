import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(
    StorageConfig.destination, {
      prefix: StorageConfig.urlPrefix,
      maxAge: StorageConfig.maxAge,
      index: false,
    });

  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors();

  const port = process.env.PORT || 3000;
    
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

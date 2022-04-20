import * as env from 'dotenv';
env.config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/transform.interceptor';
import { initDocumentation } from './documentation';
import { ValidationPipe } from './shared/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  initDocumentation(app, {
    version: '1.0',
    title: 'Toremasse Api',
    description: 'Nestjs + Nuxtjs + Mysql + Swagger',
    endpoint: '/docs',
  });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();

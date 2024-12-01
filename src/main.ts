import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 애초에 정의하지 않은 값들은 받지 않도록 DTO에 있는 것만 
    forbidNonWhitelisted: true // DTO존재하는 값만 넣도록 아니면 에러 발생시킴
  })) // 유효성 검사용 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

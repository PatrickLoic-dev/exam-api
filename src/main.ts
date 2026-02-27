import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from '../config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './common/logging/logging.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true, 
  });

  
  const logger = app.get(LoggerService);
  logger.setContext('Bootstrap');
  app.useLogger(logger);

  logger.log('Application starting...');

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              
      forbidNonWhitelisted: true,   
      transform: true,               
      transformOptions: {
        enableImplicitConversion: true, 
      },
      disableErrorMessages: config.get('env') === 'production', 
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:3000'], // Adjust this to your needs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });


  const port = config.get('port');
  const host = config.get('host');

  await app.listen(port, host, async () => {
    logger.log(`Server is running on http://${host}:${port}`);
    logger.log('✅ Application started successfully');
  });
}
bootstrap();

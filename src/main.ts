import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from '../config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './common/logging/logging.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true, // Buffer logs until custom logger is ready
  });

  // Use custom logger globally
  const logger = app.get(LoggerService);
  logger.setContext('Bootstrap');
  app.useLogger(logger);

  logger.log('Application starting...');

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Strip properties not in DTO
      forbidNonWhitelisted: true,   // Throw error if extra properties
      transform: true,               // Auto-transform payloads to DTO types
      transformOptions: {
        enableImplicitConversion: true, // Convert strings to numbers, etc.
      },
      disableErrorMessages: config.get('env') === 'production', // Hide details in prod
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:3000'], // Adjust this to your needs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });

  // Serve static files from the uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  const port = config.get('port');
  const host = config.get('host');

  await app.listen(port, host, async () => {
    logger.log(`Server is running on http://${host}:${port}`);
    logger.log('✅ Application started successfully');
  });
}
bootstrap();

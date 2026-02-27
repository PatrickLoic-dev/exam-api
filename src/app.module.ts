import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './common/logging/logging.module';
import { ObjectsModule } from './module/objects/objects.module';
import { DatabaseModule } from './database/datababse.module';

@Module({
  imports: [
    LoggingModule,
    ObjectsModule,
    DatabaseModule,
  ],
})
export class AppModule { }

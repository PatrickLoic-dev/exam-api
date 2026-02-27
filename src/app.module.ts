import { Module } from '@nestjs/common';
import { LoggingModule } from './common/logging/logging.module';
import { ObjectsModule } from './module/objects/objects.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    LoggingModule,
    ObjectsModule,
    DatabaseModule,
  ],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { ObjectsRepository } from './repositories/objects.repository';

@Module({
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsRepository],
})
export class ObjectsModule {}

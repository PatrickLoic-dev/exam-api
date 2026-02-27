import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { ObjectsRepository } from './repositories/objects.repository';
import { ObjectsGateway } from './gateway/object.gateway';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsRepository, ObjectsGateway],
})
export class ObjectsModule {}

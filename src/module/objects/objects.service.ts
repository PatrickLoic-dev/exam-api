import { Inject, Injectable } from '@nestjs/common';
import { ObjectsRepository } from './repositories/objects.repository';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectEntity } from './entities/object.entity';
import type { StorageService } from 'src/storage/storage.interface';
import { ObjectsGateway } from './gateway/object.gateway';

@Injectable()
export class ObjectsService {

  constructor(
    private readonly repository: ObjectsRepository,

    @Inject('STORAGE_SERVICE')
    private storage: StorageService,

    private gateway: ObjectsGateway,
  ) { }

  async create(dto: CreateObjectDto, imageUrl: string) {

    const object = new ObjectEntity({
      ...dto,
      imageUrl,
    });

    const created = await this.repository.create(object);

    this.gateway.emitCreated(created);

    return created;
  }


  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  async delete(id: string) {

    const deleted = await this.repository.delete(id);
    

    if (deleted?.imageUrl) {
      await this.storage.delete(
        deleted.imageUrl,
      );
    }

    this.gateway.emitDeleted(id);

    return { success: true };
  }
}
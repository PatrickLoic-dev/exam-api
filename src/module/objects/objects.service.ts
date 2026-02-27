import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ObjectsRepository } from './repositories/objects.repository';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectEntity } from './entities/object.entity';
import type { StorageService } from 'src/storage/storage.interface';
import { ObjectsGateway } from './gateway/object.gateway';
import { STORAGE_SERVICE_TOKEN } from '../../common/tokens';

@Injectable()
export class ObjectsService {

  constructor(
    private readonly repository: ObjectsRepository,

    @Inject(STORAGE_SERVICE_TOKEN)
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

  async findOne(id: string) {
    const object = await this.repository.findById(id);
    if (!object) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }
    return object;
  }

  async delete(id: string) {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Object with id ${id} not found`);
    }

    if (deleted.imageUrl) {
      await this.storage.delete(deleted.imageUrl);
    }

    this.gateway.emitDeleted(id);

    return { success: true };
  }
}
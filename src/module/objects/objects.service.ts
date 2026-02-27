import { Injectable } from '@nestjs/common';
import { ObjectsRepository } from './repositories/objects.repository';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectEntity } from './entities/object.entity';

@Injectable()
export class ObjectsService {

  constructor(
    private readonly repository: ObjectsRepository,
  ) {}

  async create(dto: CreateObjectDto, imageUrl: string) {

    const object = new ObjectEntity({
      ...dto,
      imageUrl,
    });

    return this.repository.create(object);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
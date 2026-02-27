import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Inject,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import type { StorageService } from 'src/storage/storage.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('objects')
export class ObjectsController {

  constructor(
    private readonly service: ObjectsService,

    @Inject('STORAGE_SERVICE')
    private readonly storage: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateObjectDto,
  ) {

    const imageUrl = await this.storage.upload(file);

    return this.service.create(dto, imageUrl);
  }


  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
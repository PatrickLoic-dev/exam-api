import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';

@Controller('objects')
export class ObjectsController {

  constructor(
    private readonly service: ObjectsService,
  ) {}

  @Post()
  create(@Body() dto: CreateObjectDto) {
    return this.service.create(dto, '');
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
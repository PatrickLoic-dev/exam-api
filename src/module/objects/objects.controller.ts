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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import type { StorageService } from 'src/storage/storage.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { STORAGE_SERVICE_TOKEN } from '../../common/tokens';

@Controller('objects')
export class ObjectsController {

  constructor(
    private readonly service: ObjectsService,

    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storage: StorageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp|gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
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
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
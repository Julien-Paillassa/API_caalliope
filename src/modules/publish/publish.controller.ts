import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublishService } from './publish.service';
import { CreatePublishDto } from './dto/create-publish.dto';
import { UpdatePublishDto } from './dto/update-publish.dto';

@Controller('publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post()
  create(@Body() createPublishDto: CreatePublishDto) {
    return this.publishService.create(createPublishDto);
  }

  @Get()
  findAll() {
    return this.publishService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publishService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublishDto: UpdatePublishDto) {
    return this.publishService.update(+id, updatePublishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publishService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PossessService } from './possess.service';
import { CreatePossessDto } from './dto/create-possess.dto';
import { UpdatePossessDto } from './dto/update-possess.dto';

@Controller('possess')
export class PossessController {
  constructor(private readonly possessService: PossessService) {}

  @Post()
  create(@Body() createPossessDto: CreatePossessDto) {
    return this.possessService.create(createPossessDto);
  }

  @Get()
  findAll() {
    return this.possessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.possessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePossessDto: UpdatePossessDto) {
    return this.possessService.update(+id, updatePossessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.possessService.remove(+id);
  }
}

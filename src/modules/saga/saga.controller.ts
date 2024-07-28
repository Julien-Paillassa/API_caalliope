import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SagaService } from './saga.service';
import { CreateSagaDto } from './dto/create-saga.dto';
import { UpdateSagaDto } from './dto/update-saga.dto';

@Controller('saga')
export class SagaController {
  constructor(private readonly sagaService: SagaService) {}

  @Post()
  create(@Body() createSagaDto: CreateSagaDto) {
    return this.sagaService.create(createSagaDto);
  }

  @Get()
  findAll() {
    return this.sagaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sagaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSagaDto: UpdateSagaDto) {
    return this.sagaService.update(+id, updateSagaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sagaService.remove(+id);
  }
}

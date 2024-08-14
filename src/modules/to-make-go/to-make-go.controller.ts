import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToMakeGoService } from './to-make-go.service';
import { CreateToMakeGoDto } from './dto/create-to-make-go.dto';
import { UpdateToMakeGoDto } from './dto/update-to-make-go.dto';

@Controller('to-make-go')
export class ToMakeGoController {
  constructor(private readonly toMakeGoService: ToMakeGoService) {}

  @Post()
  create(@Body() createToMakeGoDto: CreateToMakeGoDto) {
    return this.toMakeGoService.create(createToMakeGoDto);
  }

  @Get()
  findAll() {
    return this.toMakeGoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toMakeGoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToMakeGoDto: UpdateToMakeGoDto) {
    return this.toMakeGoService.update(+id, updateToMakeGoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toMakeGoService.remove(+id);
  }
}

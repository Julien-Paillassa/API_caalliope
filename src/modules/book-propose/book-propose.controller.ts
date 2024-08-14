import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookProposeService } from './book-propose.service';
import { CreateBookProposeDto } from './dto/create-book-propose.dto';
import { UpdateBookProposeDto } from './dto/update-book-propose.dto';

@Controller('book-propose')
export class BookProposeController {
  constructor(private readonly bookProposeService: BookProposeService) {}

  @Post()
  create(@Body() createBookProposeDto: CreateBookProposeDto) {
    return this.bookProposeService.create(createBookProposeDto);
  }

  @Get()
  findAll() {
    return this.bookProposeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookProposeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookProposeDto: UpdateBookProposeDto) {
    return this.bookProposeService.update(+id, updateBookProposeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookProposeService.remove(+id);
  }
}

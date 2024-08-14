import { Injectable } from '@nestjs/common';
import { CreateBookProposeDto } from './dto/create-book-propose.dto';
import { UpdateBookProposeDto } from './dto/update-book-propose.dto';

@Injectable()
export class BookProposeService {
  create(createBookProposeDto: CreateBookProposeDto) {
    return 'This action adds a new bookPropose';
  }

  findAll() {
    return `This action returns all bookPropose`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookPropose`;
  }

  update(id: number, updateBookProposeDto: UpdateBookProposeDto) {
    return `This action updates a #${id} bookPropose`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookPropose`;
  }
}

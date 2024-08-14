import { Injectable } from '@nestjs/common';
import { CreatePossessDto } from './dto/create-possess.dto';
import { UpdatePossessDto } from './dto/update-possess.dto';

@Injectable()
export class PossessService {
  create(createPossessDto: CreatePossessDto) {
    return 'This action adds a new possess';
  }

  findAll() {
    return `This action returns all possess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} possess`;
  }

  update(id: number, updatePossessDto: UpdatePossessDto) {
    return `This action updates a #${id} possess`;
  }

  remove(id: number) {
    return `This action removes a #${id} possess`;
  }
}

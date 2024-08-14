import { Injectable } from '@nestjs/common';
import { CreateCoverDto } from './dto/create-cover.dto';
import { UpdateCoverDto } from './dto/update-cover.dto';

@Injectable()
export class CoverService {
  create(createCoverDto: CreateCoverDto) {
    return 'This action adds a new cover';
  }

  findAll() {
    return `This action returns all cover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cover`;
  }

  update(id: number, updateCoverDto: UpdateCoverDto) {
    return `This action updates a #${id} cover`;
  }

  remove(id: number) {
    return `This action removes a #${id} cover`;
  }
}

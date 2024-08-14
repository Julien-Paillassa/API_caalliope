import { Injectable } from '@nestjs/common';
import { CreateToMakeGoDto } from './dto/create-to-make-go.dto';
import { UpdateToMakeGoDto } from './dto/update-to-make-go.dto';

@Injectable()
export class ToMakeGoService {
  create(createToMakeGoDto: CreateToMakeGoDto) {
    return 'This action adds a new toMakeGo';
  }

  findAll() {
    return `This action returns all toMakeGo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toMakeGo`;
  }

  update(id: number, updateToMakeGoDto: UpdateToMakeGoDto) {
    return `This action updates a #${id} toMakeGo`;
  }

  remove(id: number) {
    return `This action removes a #${id} toMakeGo`;
  }
}

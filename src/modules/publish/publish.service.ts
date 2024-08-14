import { Injectable } from '@nestjs/common';
import { CreatePublishDto } from './dto/create-publish.dto';
import { UpdatePublishDto } from './dto/update-publish.dto';

@Injectable()
export class PublishService {
  create(createPublishDto: CreatePublishDto) {
    return 'This action adds a new publish';
  }

  findAll() {
    return `This action returns all publish`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publish`;
  }

  update(id: number, updatePublishDto: UpdatePublishDto) {
    return `This action updates a #${id} publish`;
  }

  remove(id: number) {
    return `This action removes a #${id} publish`;
  }
}

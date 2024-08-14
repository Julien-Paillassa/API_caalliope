import { Test, TestingModule } from '@nestjs/testing';
import { BookProposeController } from './book-propose.controller';
import { BookProposeService } from './book-propose.service';

describe('BookProposeController', () => {
  let controller: BookProposeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookProposeController],
      providers: [BookProposeService],
    }).compile();

    controller = module.get<BookProposeController>(BookProposeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

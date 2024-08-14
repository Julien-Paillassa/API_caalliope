import { Test, TestingModule } from '@nestjs/testing';
import { BookProposeService } from './book-propose.service';

describe('BookProposeService', () => {
  let service: BookProposeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookProposeService],
    }).compile();

    service = module.get<BookProposeService>(BookProposeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

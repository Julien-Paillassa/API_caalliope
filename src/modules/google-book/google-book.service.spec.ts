import { Test, TestingModule } from '@nestjs/testing';
import { GoogleBookService } from './google-book.service';

describe('GoogleBookService', () => {
  let service: GoogleBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleBookService],
    }).compile();

    service = module.get<GoogleBookService>(GoogleBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

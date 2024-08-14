import { Test, TestingModule } from '@nestjs/testing';
import { PossessService } from './possess.service';

describe('PossessService', () => {
  let service: PossessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PossessService],
    }).compile();

    service = module.get<PossessService>(PossessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ToMakeGoService } from './to-make-go.service';

describe('ToMakeGoService', () => {
  let service: ToMakeGoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToMakeGoService],
    }).compile();

    service = module.get<ToMakeGoService>(ToMakeGoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

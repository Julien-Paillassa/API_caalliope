import { Test, TestingModule } from '@nestjs/testing';
import { PossessController } from './possess.controller';
import { PossessService } from './possess.service';

describe('PossessController', () => {
  let controller: PossessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PossessController],
      providers: [PossessService],
    }).compile();

    controller = module.get<PossessController>(PossessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

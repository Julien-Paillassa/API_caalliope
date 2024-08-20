import { Test, TestingModule } from '@nestjs/testing';
import { CoverController } from './cover.controller';
import { CoverService } from './cover.service';

describe('CoverController', () => {
  let controller: CoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverController],
      providers: [CoverService],
    }).compile();

    controller = module.get<CoverController>(CoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ToMakeGoController } from './to-make-go.controller';
import { ToMakeGoService } from './to-make-go.service';

describe('ToMakeGoController', () => {
  let controller: ToMakeGoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToMakeGoController],
      providers: [ToMakeGoService],
    }).compile();

    controller = module.get<ToMakeGoController>(ToMakeGoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

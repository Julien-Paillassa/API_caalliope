import { Test, TestingModule } from '@nestjs/testing';
import { ForumGateway } from './forum.gateway';
import { ForumService } from './forum.service';

describe('ForumGateway', () => {
  let gateway: ForumGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumGateway, ForumService],
    }).compile();

    gateway = module.get<ForumGateway>(ForumGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

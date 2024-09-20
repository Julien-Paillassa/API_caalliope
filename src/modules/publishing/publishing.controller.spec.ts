import { Test, type TestingModule } from '@nestjs/testing'
import { PublishingController } from './publishing.controller'
import { PublishingService } from './publishing.service'

describe('PublishingController', () => {
  let controller: PublishingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishingController],
      providers: [PublishingService]
    }).compile()

    controller = module.get<PublishingController>(PublishingController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

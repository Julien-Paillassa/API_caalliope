import { Test, type TestingModule } from '@nestjs/testing'
import { GoogleBookController } from './google-book.controller'

describe('GoogleBookController', () => {
  let controller: GoogleBookController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleBookController]
    }).compile()

    controller = module.get<GoogleBookController>(GoogleBookController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

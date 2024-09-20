import { Test, type TestingModule } from '@nestjs/testing'
import { GoogleBookController } from './google-book.controller'
import { GoogleBookService } from './google-book.service'

describe('GoogleBookController', () => {
  let controller: GoogleBookController
  let service: GoogleBookService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleBookController],
      providers: [
        {
          provide: GoogleBookService,
          useValue: {
            fetchBooks: jest.fn(),
            saveBooksToDatabase: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<GoogleBookController>(GoogleBookController)
    service = module.get<GoogleBookService>(GoogleBookService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('importBooks', () => {
    it('should call fetchBooks and saveBooksToDatabase', async () => {
      const books = [{ volumeInfo: { title: 'Test Book' } }];
      (service.fetchBooks as jest.Mock).mockResolvedValue(books)

      const result = await controller.importBooks('test query')

      expect(jest.spyOn(service, 'fetchBooks')).toHaveBeenCalledWith('test query')
      expect(jest.spyOn(service, 'saveBooksToDatabase')).toHaveBeenCalledWith(books)
      expect(result).toBe('Successfully imported 1 books.')
    })

    it('should handle errors in fetchBooks or saveBooksToDatabase', async () => {
      (service.fetchBooks as jest.Mock).mockRejectedValue(new Error('API Error'))

      await expect(controller.importBooks('test query')).rejects.toThrow()
    })
  })
})

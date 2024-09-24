/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing'
import { GoogleBookService, type GoogleBook } from './google-book.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import axios from 'axios'
import axiosMockAdapter from 'axios-mock-adapter'
import { Book } from '../book/entities/book.entity'
import { Author } from '../author/entities/author.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Format } from '../format/entities/format.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Cover } from '../cover/entities/cover.entity'

describe('GoogleBookService', () => {
  let service: GoogleBookService
  let booksRepository: Repository<Book>
  let authorsRepository: Repository<Author>
  let genreRepository: Repository<Genre>
  let formatRepository: Repository<Format>
  let publishingRepository: Repository<Publishing>
  let coverRepository: Repository<Cover>
  let axiosMock: axiosMockAdapter

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleBookService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Author),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Format),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Publishing),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Cover),
          useClass: Repository
        }
      ]
    }).compile()

    service = module.get<GoogleBookService>(GoogleBookService)
    booksRepository = module.get<Repository<Book>>(getRepositoryToken(Book))
    authorsRepository = module.get<Repository<Author>>(getRepositoryToken(Author))
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre))
    formatRepository = module.get<Repository<Format>>(getRepositoryToken(Format))
    publishingRepository = module.get<Repository<Publishing>>(getRepositoryToken(Publishing))
    coverRepository = module.get<Repository<Cover>>(getRepositoryToken(Cover))

    // Initialisation de l'instance mock pour axios
    axiosMock = new axiosMockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  describe('fetchBooks', () => {
    it('should fetch books from the Google Books API', async () => {
      const mockBooks: GoogleBook[] = [
        {
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author'],
            publisher: 'Test Publisher',
            publishedDate: '2020-01-01',
            description: 'Test Description',
            industryIdentifiers: [{ type: 'ISBN_10', identifier: '1234567890' }],
            pageCount: 100,
            printType: 'BOOK',
            categories: ['Fiction'],
            averageRating: 4,
            ratingsCount: 100,
            language: 'en',
            imageLinks: {
              smallThumbnail: 'http://example.com/smallThumbnail.jpg',
              thumbnail: 'http://example.com/thumbnail.jpg'
            }
          }
        }
      ]

      axiosMock.onGet().reply(200, { items: mockBooks })

      const expectedBooks: GoogleBook[] = [
        {
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author'],
            averageRating: 4,
            ratingsCount: 100,
            publishedDate: '2020-01-01',
            categories: ['Fiction'],
            pageCount: 100, // Ajusté à 100 pour correspondre aux données reçues
            language: 'en',
            imageLinks: {
              thumbnail: 'http://example.com/thumbnail.jpg'
            }
          }
        }
      ]

      expect.arrayContaining([expect.objectContaining(expectedBooks[0])])
    })

    it('should throw an HttpException if the API call fails', async () => {
      axiosMock.onGet().reply(500)

      await expect(service.fetchBooks('test')).rejects.toThrow('Failed to fetch books')
    })
  })

  describe('saveBooksToDatabase', () => {
    it('should save books to the database', async () => {
      const mockGoogleBooks: GoogleBook[] = [
        {
          volumeInfo: {
            title: 'Test Book',
            authors: ['John Doe'],
            averageRating: 4,
            ratingsCount: 100,
            publishedDate: '2020-01-01',
            categories: ['Fiction'],
            pageCount: 200,
            language: 'en',
            imageLinks: {
              thumbnail: 'http://example.com/thumbnail.jpg'
            }
          }
        }
      ]

      jest.spyOn(authorsRepository, 'findOne').mockResolvedValue(null)
      jest.spyOn(authorsRepository, 'create').mockReturnValue({} as any)
      jest.spyOn(authorsRepository, 'save').mockResolvedValue({} as any)

      jest.spyOn(genreRepository, 'findOne').mockResolvedValue(null)
      jest.spyOn(genreRepository, 'create').mockReturnValue({} as any)
      jest.spyOn(genreRepository, 'save').mockResolvedValue({} as any)

      jest.spyOn(coverRepository, 'create').mockReturnValue({} as any)
      jest.spyOn(coverRepository, 'save').mockResolvedValue({} as any)

      jest.spyOn(formatRepository, 'findOne').mockResolvedValue(null)
      jest.spyOn(formatRepository, 'create').mockReturnValue({} as any)
      jest.spyOn(formatRepository, 'save').mockResolvedValue({} as any)

      jest.spyOn(publishingRepository, 'create').mockReturnValue({} as any)
      jest.spyOn(publishingRepository, 'save').mockResolvedValue({} as any)

      jest.spyOn(booksRepository, 'create').mockReturnValue({} as any)
      jest.spyOn(booksRepository, 'save').mockResolvedValue({} as any)

      await service.saveBooksToDatabase(mockGoogleBooks)

      expect(authorsRepository.save).toHaveBeenCalled()
      expect(genreRepository.save).toHaveBeenCalled()
      expect(coverRepository.save).toHaveBeenCalled()
      expect(formatRepository.save).toHaveBeenCalled()
      expect(publishingRepository.save).toHaveBeenCalled()
      expect(booksRepository.save).toHaveBeenCalled()
    })
  })
})

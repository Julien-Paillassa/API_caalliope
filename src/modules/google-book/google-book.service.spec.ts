/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing'
import { type GoogleBook, GoogleBookService } from './google-book.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Book } from '../book/entities/book.entity'
import { Author } from '../author/entities/author.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Format } from '../format/entities/format.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Repository } from 'typeorm'
import axios from 'axios'
import { Status } from '../admin/entities/status.enum'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GoogleBookService', () => {
  let service: GoogleBookService
  let bookRepository: Repository<Book>
  let authorRepository: Repository<Author>
  let genreRepository: Repository<Genre>
  let formatRepository: Repository<Format>
  let publishingRepository: Repository<Publishing>
  let coverRepository: Repository<Cover>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleBookService,
        { provide: getRepositoryToken(Book), useClass: Repository },
        { provide: getRepositoryToken(Author), useClass: Repository },
        { provide: getRepositoryToken(Genre), useClass: Repository },
        { provide: getRepositoryToken(Format), useClass: Repository },
        { provide: getRepositoryToken(Publishing), useClass: Repository },
        { provide: getRepositoryToken(Cover), useClass: Repository }
      ]
    }).compile()

    service = module.get<GoogleBookService>(GoogleBookService)
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book))
    authorRepository = module.get<Repository<Author>>(getRepositoryToken(Author))
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre))
    formatRepository = module.get<Repository<Format>>(getRepositoryToken(Format))
    publishingRepository = module.get<Repository<Publishing>>(getRepositoryToken(Publishing))
    coverRepository = module.get<Repository<Cover>>(getRepositoryToken(Cover))

    jest.spyOn(mockedAxios, 'get').mockImplementation(jest.fn())
    jest.spyOn(authorRepository, 'findOne').mockResolvedValue(null)
    jest.spyOn(authorRepository, 'create').mockImplementation((data) => data as any)
    jest.spyOn(authorRepository, 'save').mockResolvedValue({} as any)

    jest.spyOn(genreRepository, 'findOne').mockResolvedValue(null)
    jest.spyOn(genreRepository, 'create').mockImplementation((data) => data as any)
    jest.spyOn(genreRepository, 'save').mockResolvedValue({} as any)

    jest.spyOn(coverRepository, 'create').mockImplementation((data) => data as any)
    jest.spyOn(coverRepository, 'save').mockResolvedValue({} as any)

    jest.spyOn(formatRepository, 'findOne').mockResolvedValue(null)
    jest.spyOn(formatRepository, 'create').mockImplementation((data) => data as any)
    jest.spyOn(formatRepository, 'save').mockResolvedValue({} as any)

    jest.spyOn(publishingRepository, 'create').mockImplementation((data) => data as any)
    jest.spyOn(publishingRepository, 'save').mockResolvedValue({} as any)

    jest.spyOn(bookRepository, 'create').mockImplementation((data) => data as any)
    jest.spyOn(bookRepository, 'save').mockResolvedValue({} as any)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should save books to the database', async () => {
    const books = [{
      volumeInfo: {
        title: 'Test Book',
        authors: ['John Doe'],
        categories: ['Fiction'],
        industryIdentifiers: [{ type: 'ISBN_13', identifier: '1234567890123' }],
        language: 'en',
        averageRating: 4.5,
        ratingsCount: 10,
        description: 'A test book description.',
        publisher: 'Test Publisher',
        publishedDate: '2024-01-01',
        pageCount: 200,
        printType: 'BOOK',
        imageLinks: {
          thumbnail: 'http://example.com/thumbnail.jpg'
        }
      }
    }]

    await service.saveBooksToDatabase(books)

    expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { lastName: 'Doe' } })
    expect(authorRepository.create).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      avatar: undefined,
      email: 'Unknown Email',
      birthDate: 'Unknown Birth Date'
    })
    expect(authorRepository.save).toHaveBeenCalled()

    expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { genre: 'Fiction' } })
    expect(genreRepository.create).toHaveBeenCalledWith({ genre: 'Fiction' })
    expect(genreRepository.save).toHaveBeenCalled()

    expect(coverRepository.create).toHaveBeenCalledWith({
      filename: 'thumbnail.jpg'
    })
    expect(coverRepository.save).toHaveBeenCalled()

    expect(formatRepository.findOne).toHaveBeenCalledWith({ where: { type: 'BOOK' } })
    expect(formatRepository.create).toHaveBeenCalledWith({
      type: 'BOOK',
      language: 'en'
    })
    expect(formatRepository.save).toHaveBeenCalled()

    expect(publishingRepository.create).toHaveBeenCalledWith({
      label: 'Test Publisher',
      language: 'en',
      isbn: '1234567890123',
      nbPages: 200,
      publicationDate: '2024-01-01',
      format: {} as any
    })
    expect(publishingRepository.save).toHaveBeenCalled()

    expect(bookRepository.create).toHaveBeenCalledWith({
      title: 'Test Book',
      summary: 'A test book description.',
      publicationDate: '2024-01-01',
      status: Status.ACCEPTED,
      author: {} as any,
      cover: {} as any,
      genre: [{} as any],
      publishing: [{} as any]
    })
    expect(bookRepository.save).toHaveBeenCalled()
  })

  describe('fetchBooks', () => {
    it('should fetch books from Google API', async () => {
      const mockedBooks: GoogleBook[] = [{
        volumeInfo: {
          title: 'Test Book',
          authors: ['John Doe'],
          categories: ['Fiction'],
          industryIdentifiers: [{ type: 'ISBN_13', identifier: '1234567890123' }],
          language: 'en',
          averageRating: 4.5,
          ratingsCount: 10,
          description: 'A test book description.',
          publisher: 'Test Publisher',
          publishedDate: '2024-01-01',
          pageCount: 200,
          printType: 'BOOK',
          imageLinks: {
            thumbnail: 'http://example.com/thumbnail.jpg'
          }
        }
      }]

      mockedAxios.get.mockResolvedValue({ data: { items: mockedBooks } })

      const books = await service.fetchBooks('test query')
      expect(books).toEqual(mockedBooks)
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('test query'))
    })

    it('should handle errors when fetching books', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'))

      await expect(service.fetchBooks('test query')).rejects.toThrow('Failed to fetch books')
    })
  })
})

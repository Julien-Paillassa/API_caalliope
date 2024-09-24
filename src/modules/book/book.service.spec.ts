/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, type TestingModule } from '@nestjs/testing'
import { BookService } from './book.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { Book } from './entities/book.entity'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Status } from '../admin/entities/status.enum'
import { type CreateBookDto } from './dto/create-book.dto'
import { type UpdateBookDto } from './dto/update-book.dto'
import { Cover } from '../cover/entities/cover.entity'
import { Author } from '../author/entities/author.entity'

const mockBookRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(),
  remove: jest.fn(),
  merge: jest.fn(),
  find: jest.fn()
}

describe('BookService', () => {
  let service: BookService
  let repository: Repository<Book>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository
        }
      ]
    }).compile()

    service = module.get<BookService>(BookService)
    repository = module.get<Repository<Book>>(getRepositoryToken(Book))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should successfully create a book', async () => {
      const createBookDto: Partial<Book> = {
        title: 'The Hobbit',
        summary: 'A story about a hobbit named Bilbo.',
        author: new Author()
      }
      const savedBook = { id: 1, ...createBookDto }

      mockBookRepository.create.mockReturnValue(createBookDto)
      mockBookRepository.save.mockResolvedValue(savedBook)

      const result = await service.createBook(createBookDto)

      expect(mockBookRepository.create).toHaveBeenCalledWith(createBookDto)
      expect(mockBookRepository.save).toHaveBeenCalledWith(createBookDto)
      expect(result).toEqual(savedBook)
    })

    it('should throw an error if book creation fails', async () => {
      const createBookDto = {
        title: 'The Hobbit',
        summary: 'A story about a hobbit named Bilbo.',
        publicationDate: '1937-09-21'
      }
      mockBookRepository.save.mockRejectedValue(new Error())

      await expect(service.createBook(createBookDto)).rejects.toThrow(
        new HttpException('Failed to create book', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('findAll', () => {
    it('should return all books', async () => {
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1, title: 'Book 1' }])
      }

      mockBookRepository.createQueryBuilder.mockReturnValue(queryBuilderMock)

      const result = await service.findAll()

      expect(result).toEqual([{ id: 1, title: 'Book 1' }])
      expect(queryBuilderMock.getMany).toHaveBeenCalled()
    })

    it('should throw an error if retrieval fails', async () => {
      mockBookRepository.createQueryBuilder.mockImplementation(() => {
        throw new Error()
      })

      await expect(service.findAll()).rejects.toThrow(
        new HttpException('Failed to retrieve books', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('findOne', () => {
    it('should return a single book by id', async () => {
      const book = { id: 1, title: 'Book 1', summary: 'Summary', publicationDate: '2022-01-01' }
      mockBookRepository.findOne.mockResolvedValue(book)

      const result = await service.findOne(1)

      expect(result).toEqual(book)
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'cover',
          'author',
          'comment',
          'comment.user',
          'comment.user.avatar',
          'genre',
          'userBook',
          'publishing',
          'publishing.format'
        ]
      })
    })

    it('should throw an error if book is not found', async () => {
      mockBookRepository.findOne.mockResolvedValue(null) // Simule un livre introuvable

      await expect(service.findOne(999)).rejects.toThrow(
        new HttpException('Book not found', HttpStatus.NOT_FOUND)
      )
    })
  })

  describe('update', () => {
    it('should update a book', async () => {
      const book: Book = {
        id: 1,
        title: 'Old Title',
        summary: 'Old Summary',
        publicationDate: '2022-01-01',
        status: Status.WAITING,
        cover: new Cover(),
        author: new Author(),
        comment: [],
        genre: [],
        userBook: [],
        publishing: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        ratingNumber: 0
      }
      const updateBookDto: UpdateBookDto = {
        title: 'New Title',
        summary: 'New Summary',
        status: Status.ACCEPTED,
        id: 1
      }
      const updatedBook = { ...book, ...updateBookDto }

      mockBookRepository.findOneBy.mockResolvedValue(book)
      mockBookRepository.merge.mockImplementation((existing, update) => {
        Object.assign(existing, update)
        return existing
      })
      mockBookRepository.save.mockResolvedValue(updatedBook)

      const result = await service.update(1, updateBookDto)

      expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockBookRepository.merge).toHaveBeenCalledWith(book, updateBookDto)
      expect(mockBookRepository.save).toHaveBeenCalledWith(updatedBook)
      expect(result).toEqual(updatedBook)
    })

    it('should throw a 404 error if book to update is not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null)

      const updateBookDto: UpdateBookDto = {
        title: 'New Title',
        summary: 'New Summary',
        id: 1,
        status: Status.ACCEPTED
      }

      await expect(service.update(999, updateBookDto)).rejects.toThrow(
        new HttpException('Book not found', HttpStatus.NOT_FOUND)
      )
    })
  })

  describe('remove', () => {
    it('should delete a book', async () => {
      const book = { id: 1, title: 'Book to delete' }

      mockBookRepository.findOneBy.mockResolvedValue(book)
      mockBookRepository.remove.mockResolvedValue(book)

      const result = await service.remove(1)

      expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockBookRepository.remove).toHaveBeenCalledWith(book)
      expect(result).toEqual(book)
    })

    it('should throw a 404 error if book to delete is not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(999)).rejects.toThrow(
        new HttpException('Failed to delete book', HttpStatus.NOT_FOUND)
      )
    })
  })

  describe('findWaiting', () => {
    it('should return books with status WAITING', async () => {
      const books = [{ id: 1, title: 'Waiting Book', status: Status.WAITING }]

      mockBookRepository.find.mockResolvedValue(books)

      const result = await service.findWaiting()

      expect(mockBookRepository.find).toHaveBeenCalledWith({
        relations: ['cover', 'publishing'],
        where: { status: Status.WAITING }
      })
      expect(result).toEqual(books)
    })

    it('should throw an error if retrieval fails', async () => {
      mockBookRepository.find.mockRejectedValue(new Error())

      await expect(service.findWaiting()).rejects.toThrow(
        new HttpException('Failed to retrieve books waitings', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})

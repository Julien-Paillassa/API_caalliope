/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { UserBookService } from './user-book.service'
import { UserBook } from './entities/user-book.entity'
import { type CreateUserBookDto } from './dto/create-user-book.dto'
import { type UpdateUserBookDto } from './dto/update-user-book.dto'
import { UserBookStatus } from './entities/user-book-status.enum'

describe('UserBookService', () => {
  let service: UserBookService
  let userBookRepository: Repository<UserBook>

  const mockUserBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    clear: jest.fn() // add clear method if needed
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBookService,
        {
          provide: getRepositoryToken(UserBook),
          useValue: mockUserBookRepository
        }
      ]
    }).compile()

    service = module.get<UserBookService>(UserBookService)
    userBookRepository = module.get<Repository<UserBook>>(getRepositoryToken(UserBook))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addBookToUser', () => {
    it('should successfully add a book to a user', async () => {
      const createUserBookDto: CreateUserBookDto = {
        status: UserBookStatus.READING,
        bookId: 1,
        userId: 1
      }
      const userBook = {
        id: 1,
        status: createUserBookDto.status,
        book: { id: createUserBookDto.bookId },
        user: { id: createUserBookDto.userId }
      } as UserBook

      mockUserBookRepository.create.mockReturnValue(userBook)
      mockUserBookRepository.save.mockResolvedValue(userBook)

      const result = await service.addBookToUser(createUserBookDto)
      expect(result).toEqual(userBook)
      expect(mockUserBookRepository.create).toHaveBeenCalledWith({
        user: { id: createUserBookDto.userId },
        book: { id: createUserBookDto.bookId },
        status: createUserBookDto.status
      })
      expect(mockUserBookRepository.save).toHaveBeenCalledWith(userBook)
    })

    it('should throw an error if adding book fails', async () => {
      const createUserBookDto: CreateUserBookDto = {
        status: UserBookStatus.READING,
        bookId: 1,
        userId: 1
      }
      mockUserBookRepository.save.mockRejectedValue(new Error())

      await expect(service.addBookToUser(createUserBookDto)).rejects.toThrow(HttpException)
      expect(mockUserBookRepository.save).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('updateBookStatus', () => {
    it('should successfully update book status', async () => {
      const updateUserBookDto: UpdateUserBookDto = {
        status: UserBookStatus.READ
      }
      const existingUserBook = { id: 1, status: UserBookStatus.READING } as UserBook

      mockUserBookRepository.findOne.mockResolvedValue(existingUserBook)
      const updatedUserBook = { ...existingUserBook, status: updateUserBookDto.status }
      mockUserBookRepository.save.mockResolvedValue(updatedUserBook)

      const result = await service.updateBookStatus(1, 1, updateUserBookDto)

      expect(result).toEqual(updatedUserBook)
      expect(mockUserBookRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 }, book: { id: 1 } }
      })
      expect(mockUserBookRepository.save).toHaveBeenCalledWith(updatedUserBook)
    })

    it('should throw an error if userBook not found', async () => {
      const updateUserBookDto: UpdateUserBookDto = {
        status: UserBookStatus.READ
      }
      mockUserBookRepository.findOne.mockResolvedValue(null)

      await expect(service.updateBookStatus(1, 1, updateUserBookDto)).rejects.toThrow(HttpException)
      expect(mockUserBookRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 }, book: { id: 1 } }
      })
    })

    it('should throw an error if updating status fails', async () => {
      const updateUserBookDto: UpdateUserBookDto = {
        status: UserBookStatus.READ
      }
      mockUserBookRepository.findOne.mockResolvedValue(new UserBook())
      mockUserBookRepository.save.mockRejectedValue(new Error())

      await expect(service.updateBookStatus(1, 1, updateUserBookDto)).rejects.toThrow(HttpException)
    })
  })

  describe('getBooksForUser', () => {
    it('should successfully return books for a user', async () => {
      const userBooks = [
        { id: 1, status: UserBookStatus.READING, book: { id: 1, title: 'Book 1' } },
        { id: 2, status: UserBookStatus.READ, book: { id: 2, title: 'Book 2' } }
      ] as UserBook[]
      mockUserBookRepository.find.mockResolvedValue(userBooks)

      const result = await service.getBooksForUser(1)
      expect(result).toEqual(userBooks)
      expect(mockUserBookRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['book']
      })
    })

    it('should throw an error if getting books fails', async () => {
      mockUserBookRepository.find.mockRejectedValue(new Error())

      await expect(service.getBooksForUser(1)).rejects.toThrow(HttpException)
      expect(mockUserBookRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['book']
      })
    })
  })
})

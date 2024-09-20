import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { type CreateUserDto } from './dto/create-user.dto'
import { type UpdateUserDto } from './dto/update-user.dto'
import { UserRole } from './entities/user-role.enum'
import { BookService } from '../book/book.service'

describe('UserService', () => {
  let service: UserService
  let userRepository: Repository<User>
  let bookService: BookService

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneByOrFail: jest.fn(),
    findOneBy: jest.fn(),
    findOneOrFail: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn()
  }

  const mockBookService = {
    findWaiting: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: BookService,
          useValue: mockBookService
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    bookService = module.get<BookService>(BookService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should successfully create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Antoine',
        lastName: 'Dupont',
        password: 'strongPassword987',
        email: 'antoine.dupont@example.com',
        username: 'antoinnette',
        role: UserRole.CONTRIBUTOR
      }
      const savedUser = { id: 1, ...createUserDto }

      mockUserRepository.create.mockReturnValue(savedUser)
      mockUserRepository.save.mockResolvedValue(savedUser)

      const result = await service.create(createUserDto)
      expect(result).toEqual(savedUser)
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto)
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser)
    })

    it('should throw an error when create fails', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Antoine',
        lastName: 'Dupont',
        password: 'strongPassword987',
        email: 'antoine.dupont@example.com',
        username: 'antoinnette',
        role: UserRole.CONTRIBUTOR
      }
      mockUserRepository.save.mockRejectedValue(new Error())

      await expect(service.create(createUserDto)).rejects.toThrow(HttpException)
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: UserRole.CONTRIBUTOR },
        { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: UserRole.MODERATOR }
      ]
      mockUserRepository.find.mockResolvedValue(users)

      const result = await service.findAll()
      expect(result).toEqual(users)
      expect(mockUserRepository.find).toHaveBeenCalledWith({ relations: ['avatar'] })
    })

    it('should throw an error when findAll fails', async () => {
      mockUserRepository.find.mockRejectedValue(new Error())

      await expect(service.findAll()).rejects.toThrow(HttpException)
      expect(mockUserRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 1,
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@example.com',
        role: UserRole.MODERATOR
      }

      mockUserRepository.findOneOrFail.mockResolvedValue(user)
      mockBookService.findWaiting.mockResolvedValue([])

      const result = await service.findOne(1)

      expect(result).toEqual(user)
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith(
        { where: { id: 1 }, relations: ['avatar'] }
      )
      expect(mockBookService.findWaiting).not.toHaveBeenCalled() // Role non-admin
    })

    it('should return user with waiting books if role is admin', async () => {
      const user = { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin.user@example.com', role: UserRole.ADMIN }
      const waitingBooks = [{ id: 1, title: 'Book 1' }]
      mockUserRepository.findOneOrFail.mockResolvedValue(user)
      mockBookService.findWaiting.mockResolvedValue(waitingBooks)

      const result = await service.findOne(1)
      expect(result).toEqual({ ...user, bookWaiting: waitingBooks })
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['avatar'] })
      expect(mockBookService.findWaiting).toHaveBeenCalled()
    })

    it('should throw a 404 error if user is not found', async () => {
      mockUserRepository.findOneOrFail.mockRejectedValue(new Error('User not found'))

      await expect(service.findOne(999)).rejects.toThrowError(new HttpException('User not found', HttpStatus.NOT_FOUND))
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 999 }, relations: ['avatar'] })
    })
  })

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Mike', lastName: 'Smith', email: 'mike.smith@example.com', role: UserRole.CONTRIBUTOR }
      const existingUser = { id: 1, firstName: 'Michael', lastName: 'Smith', email: 'michael.smith@example.com', role: UserRole.CONTRIBUTOR }
      const updatedUser = { ...existingUser, ...updateUserDto }

      mockUserRepository.findOneBy.mockResolvedValue(existingUser)
      mockUserRepository.merge.mockReturnValue(updatedUser)
      mockUserRepository.save.mockResolvedValue(updatedUser)

      const result = await service.update(1, updateUserDto)

      expect(result).toEqual(updatedUser)
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockUserRepository.merge).toHaveBeenCalledWith(existingUser, updateUserDto)
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser)
    })

    it('should throw a 404 error if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null)

      await expect(service.update(999, {
        firstName: 'Mike',
        role: UserRole.ADMIN
      })).rejects.toThrow(HttpException)
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('remove', () => {
    it('should remove and return a user', async () => {
      const user = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: UserRole.CONTRIBUTOR }
      mockUserRepository.findOneBy.mockResolvedValue(user)
      mockUserRepository.remove.mockResolvedValue(user)

      const result = await service.remove(1)
      expect(result).toEqual(user)
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user)
    })

    it('should throw a 404 error if user to delete is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(999)).rejects.toThrow(HttpException)
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})

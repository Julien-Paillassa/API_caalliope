import { Test, type TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { HttpException, HttpStatus } from '@nestjs/common'
import { AuthorService } from './author.service'
import { Author } from './entities/author.entity'
import { type CreateAuthorDto } from './dto/create-author.dto'
import { type UpdateAuthorDto } from './dto/update-author.dto'

describe('AuthorService', () => {
  let service: AuthorService
  let repository: Repository<Author>

  const mockAuthorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn()
  }

  const author = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    birthDate: '1970-01-01'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorRepository
        }
      ]
    }).compile()

    service = module.get<AuthorService>(AuthorService)
    repository = module.get<Repository<Author>>(getRepositoryToken(Author))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should successfully create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        birthDate: '1970-01-01'
      }

      mockAuthorRepository.create.mockReturnValue(createAuthorDto)
      mockAuthorRepository.save.mockResolvedValue(createAuthorDto)

      const result = await service.create(createAuthorDto)

      expect(result).toEqual(createAuthorDto)
      expect(mockAuthorRepository.create).toHaveBeenCalledWith(createAuthorDto)
      expect(mockAuthorRepository.save).toHaveBeenCalledWith(createAuthorDto)
    })

    it('should throw an error if creating the author fails', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        birthDate: '1970-01-01'
      }

      mockAuthorRepository.save.mockRejectedValue(new Error('Save error'))
      await expect(service.create(createAuthorDto)).rejects.toThrow(
        new HttpException('Failed to create author', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('findAll', () => {
    it('should return a list of authors', async () => {
      mockAuthorRepository.find.mockResolvedValue([author])

      const result = await service.findAll()
      expect(result).toEqual([author])
      expect(mockAuthorRepository.find).toHaveBeenCalledWith({ relations: ['avatar'] })
    })

    it('should throw an error if retrieving authors fails', async () => {
      mockAuthorRepository.find.mockRejectedValue(new Error('Find error'))
      await expect(service.findAll()).rejects.toThrow(
        new HttpException('Failed to retrieve authors', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('findOne', () => {
    it('should return a single author by id', async () => {
      mockAuthorRepository.findOneOrFail.mockResolvedValue(author)

      const result = await service.findOne(1)
      expect(result).toEqual(author)
      expect(mockAuthorRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['avatar']
      })
    })

    it('should throw a 404 error if author is not found', async () => {
      mockAuthorRepository.findOneOrFail.mockRejectedValue(new Error('Not found'))
      await expect(service.findOne(2)).rejects.toThrow(
        new HttpException('Author not found', HttpStatus.NOT_FOUND)
      )
    })
  })

  describe('update', () => {
    it('should update and return the updated author', async () => {
      const updateAutorDto: UpdateAuthorDto = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@gmail.com',
        birthDate: '1970-01-01'
      }

      const authorBeforeUpdate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        birthDate: '1970-01-01'
      }

      const updatedAuthor = {
        id: 1,
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@gmail.com',
        birthDate: '1970-01-01'
      }

      mockAuthorRepository.findOneBy.mockResolvedValue(authorBeforeUpdate)
      mockAuthorRepository.merge.mockImplementation((existing, update) => {
        Object.assign(existing, update)
        return existing
      })
      mockAuthorRepository.save.mockResolvedValue(updatedAuthor)

      const result = await service.update(1, updateAutorDto)

      expect(result).toEqual(updatedAuthor)
      expect(mockAuthorRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockAuthorRepository.merge).toHaveBeenCalledWith(authorBeforeUpdate, updateAutorDto)
      expect(mockAuthorRepository.save).toHaveBeenCalledWith(updatedAuthor)
    })

    it('should throw a 404 error if author is not found', async () => {
      const updateAutorDto: UpdateAuthorDto = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@gmail.com',
        birthDate: '1970-01-01'
      }
      mockAuthorRepository.findOneBy.mockResolvedValue(null)
      await expect(service.update(1, updateAutorDto)).rejects.toThrow(
        new HttpException('Author not found', HttpStatus.NOT_FOUND)
      )
    })

    it('should throw an error if updating the author fails', async () => {
      const updateAutorDto: UpdateAuthorDto = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@gmail.com',
        birthDate: '1970-01-01'
      }
      mockAuthorRepository.findOneBy.mockResolvedValue(author)
      mockAuthorRepository.save.mockRejectedValue(new Error('Save error'))
      await expect(service.update(1, updateAutorDto)).rejects.toThrow(
        new HttpException('Failed to update author', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('remove', () => {
    it('should delete the author and return it', async () => {
      mockAuthorRepository.findOneBy.mockResolvedValue(author)
      mockAuthorRepository.remove.mockResolvedValue(author)

      const result = await service.remove(1)
      expect(result).toEqual(author)
      expect(mockAuthorRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockAuthorRepository.remove).toHaveBeenCalledWith(author)
    })

    it('should throw a 404 error if author is not found', async () => {
      mockAuthorRepository.findOneBy.mockResolvedValue(null)
      await expect(service.remove(1)).rejects.toThrow(
        new HttpException('Author not found', HttpStatus.NOT_FOUND)
      )
    })

    it('should throw an error if removing the author fails', async () => {
      mockAuthorRepository.findOneBy.mockResolvedValue(author)
      mockAuthorRepository.remove.mockRejectedValue(new Error('Remove error'))
      await expect(service.remove(1)).rejects.toThrow(
        new HttpException('Failed to remove author', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})

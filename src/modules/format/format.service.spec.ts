/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { FormatService } from './format.service'
import { Format } from './entities/format.entity'
import { type CreateFormatDto } from './dto/create-format.dto'
import { type UpdateFormatDto } from './dto/update-format.dto'

describe('FormatService', () => {
  let service: FormatService
  let formatRepository: Repository<Format>

  const mockFormatRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneByOrFail: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormatService,
        {
          provide: getRepositoryToken(Format),
          useValue: mockFormatRepository
        }
      ]
    }).compile()

    service = module.get<FormatService>(FormatService)
    formatRepository = module.get<Repository<Format>>(getRepositoryToken(Format))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should successfully create and return a format', async () => {
      const createFormatDto: CreateFormatDto = {
        type: 'Paperback',
        language: 'English'
      }
      const savedFormat = { id: 1, ...createFormatDto }

      mockFormatRepository.create.mockReturnValue(savedFormat)
      mockFormatRepository.save.mockResolvedValue(savedFormat)

      const result = await service.create(createFormatDto)
      expect(result).toEqual(savedFormat)
      expect(mockFormatRepository.create).toHaveBeenCalledWith(createFormatDto)
      expect(mockFormatRepository.save).toHaveBeenCalledWith(savedFormat)
    })

    it('should throw an error when create fails', async () => {
      const createFormatDto: CreateFormatDto = {
        type: 'Paperback',
        language: 'English'
      }
      mockFormatRepository.save.mockRejectedValue(new Error())

      await expect(service.create(createFormatDto)).rejects.toThrow(HttpException)
      expect(mockFormatRepository.save).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('findAll', () => {
    it('should return all formats', async () => {
      const formats = [
        { id: 1, type: 'Paperback', language: 'English' },
        { id: 2, type: 'Ebook', language: 'French' }
      ]
      mockFormatRepository.find.mockResolvedValue(formats)

      const result = await service.findAll()
      expect(result).toEqual(formats)
      expect(mockFormatRepository.find).toHaveBeenCalled()
    })

    it('should throw a 404 error when no formats are found', async () => {
      mockFormatRepository.find.mockResolvedValue([])

      await expect(service.findAll()).rejects.toThrow(HttpException)
      expect(mockFormatRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a format by id', async () => {
      const format = { id: 1, type: 'Paperback', language: 'English' }
      mockFormatRepository.findOneByOrFail.mockResolvedValue(format)

      const result = await service.findOne(1)
      expect(result).toEqual(format)
      expect(mockFormatRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 })
    })

    it('should throw a 404 error if format is not found', async () => {
      mockFormatRepository.findOneByOrFail.mockRejectedValue(new Error())

      await expect(service.findOne(999)).rejects.toThrow(HttpException)
      expect(mockFormatRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('update', () => {
    it('should update and return a format', async () => {
      const updateFormatDto: UpdateFormatDto = { type: 'Pocket', language: 'French' }
      const existingFormat = { id: 1, type: 'Paperback', language: 'English' }

      mockFormatRepository.findOneBy.mockResolvedValue(existingFormat)
      const updatedFormat = { ...existingFormat, ...updateFormatDto }
      mockFormatRepository.save.mockResolvedValue(updatedFormat)
      mockFormatRepository.merge.mockImplementation((existing, update) => {
        Object.assign(existing, update)
        return existing
      })

      const result = await service.update(1, updateFormatDto)

      expect(result).toEqual(updatedFormat)
      expect(mockFormatRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockFormatRepository.merge).toHaveBeenCalledWith(existingFormat, updateFormatDto)
      expect(mockFormatRepository.save).toHaveBeenCalledWith(updatedFormat) // Modifié ici
    })

    it('should throw a 404 error if format is not found', async () => {
      mockFormatRepository.findOneBy.mockResolvedValue(null)

      await expect(service.update(999, { type: 'Pocket' })).rejects.toThrow(HttpException)
      expect(mockFormatRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('remove', () => {
    it('should remove and return a format', async () => {
      const format = { id: 1, type: 'Paperback', language: 'English' }
      mockFormatRepository.findOneBy.mockResolvedValue(format)
      mockFormatRepository.remove.mockResolvedValue(format)

      const result = await service.remove(1)
      expect(result).toEqual(format)
      expect(mockFormatRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockFormatRepository.remove).toHaveBeenCalledWith(format)
    })

    it('should throw a 404 error if format to delete is not found', async () => {
      mockFormatRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(999)).rejects.toThrow(HttpException)
      expect(mockFormatRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})

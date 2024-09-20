import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { PublishingService } from './publishing.service'
import { Publishing } from './entities/publishing.entity'
import { type CreatePublishingDto } from './dto/create-publishing.dto'
import { type UpdatePublishingDto } from './dto/update-publishing.dto'
import { Status } from '../admin/entities/status.enum'

describe('PublishingService', () => {
  let service: PublishingService
  let publishingRepository: Repository<Publishing>

  const mockPublishingRepository = {
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
        PublishingService,
        {
          provide: getRepositoryToken(Publishing),
          useValue: mockPublishingRepository
        }
      ]
    }).compile()

    service = module.get<PublishingService>(PublishingService)
    publishingRepository = module.get<Repository<Publishing>>(getRepositoryToken(Publishing))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should successfully create and return a publishing', async () => {
      const createPublishingDto: CreatePublishingDto = {
        label: 'Hachette',
        language: 'French',
        isbn: '9782070423201',
        nbPages: 200,
        publicationDate: '2021-01-01'
      }
      const savedPublishing = { id: 1, ...createPublishingDto }

      mockPublishingRepository.create.mockReturnValue(savedPublishing)
      mockPublishingRepository.save.mockResolvedValue(savedPublishing)

      const result = await service.create(createPublishingDto)
      expect(result).toEqual(savedPublishing)
      expect(mockPublishingRepository.create).toHaveBeenCalledWith(createPublishingDto)
      expect(mockPublishingRepository.save).toHaveBeenCalledWith(savedPublishing)
    })

    it('should throw an error when create fails', async () => {
      const createPublishingDto: CreatePublishingDto = {
        label: 'Hachette',
        language: 'French',
        isbn: '9782070423201',
        nbPages: 200,
        publicationDate: '2021-01-01'
      }
      mockPublishingRepository.save.mockRejectedValue(new Error())

      await expect(service.create(createPublishingDto)).rejects.toThrow(HttpException)
      expect(mockPublishingRepository.save).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('findAll', () => {
    it('should return all publishings', async () => {
      const publishings = [
        { id: 1, label: 'Hachette', language: 'French', isbn: '9782070423201', nbPages: 200, publicationDate: '2021-01-01' },
        { id: 2, label: 'Gallimard', language: 'English', isbn: '9782070423202', nbPages: 250, publicationDate: '2021-01-02' }
      ]
      mockPublishingRepository.find.mockResolvedValue(publishings)

      const result = await service.findAll()
      expect(result).toEqual(publishings)
      expect(mockPublishingRepository.find).toHaveBeenCalled()
    })

    it('should throw a 404 error when no publishings are found', async () => {
      mockPublishingRepository.find.mockResolvedValue([])

      await expect(service.findAll()).rejects.toThrow(HttpException)
      expect(mockPublishingRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a publishing by id', async () => {
      const publishing = { id: 1, label: 'Hachette', language: 'French', isbn: '9782070423201', nbPages: 200, publicationDate: '2021-01-01' }
      mockPublishingRepository.findOneByOrFail.mockResolvedValue(publishing)

      const result = await service.findOne(1)
      expect(result).toEqual(publishing)
      expect(mockPublishingRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 })
    })

    it('should throw a 404 error if publishing is not found', async () => {
      mockPublishingRepository.findOneByOrFail.mockRejectedValue(new Error())

      await expect(service.findOne(999)).rejects.toThrow(HttpException)
      expect(mockPublishingRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('update', () => {
    it('should update and return a publishing', async () => {
      const updatePublishingDto: UpdatePublishingDto = { label: 'Gallimard', language: 'English', status: Status.WAITING }
      const existingPublishing = { id: 1, label: 'Hachette', language: 'French', isbn: '9782070423201', nbPages: 200, publicationDate: '2021-01-01' }

      mockPublishingRepository.findOneBy.mockResolvedValue(existingPublishing)
      const updatedPublishing = { ...existingPublishing, ...updatePublishingDto }
      mockPublishingRepository.save.mockResolvedValue(updatedPublishing)
      mockPublishingRepository.merge.mockImplementation((existing, update) => {
        Object.assign(existing, update)
        return existing
      })

      const result = await service.update(1, updatePublishingDto)

      expect(result).toEqual(updatedPublishing)
      expect(mockPublishingRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockPublishingRepository.merge).toHaveBeenCalledWith(existingPublishing, updatePublishingDto)
      expect(mockPublishingRepository.save).toHaveBeenCalledWith(updatedPublishing)
    })

    it('should throw a 404 error if publishing is not found', async () => {
      mockPublishingRepository.findOneBy.mockResolvedValue(null)

      await expect(service.update(999, {
        label: 'Gallimard',
        status: Status.WAITING
      })).rejects.toThrow(HttpException)
      expect(mockPublishingRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('remove', () => {
    it('should remove and return a publishing', async () => {
      const publishing = { id: 1, label: 'Hachette', language: 'French', isbn: '9782070423201', nbPages: 200, publicationDate: '2021-01-01' }
      mockPublishingRepository.findOneBy.mockResolvedValue(publishing)
      mockPublishingRepository.remove.mockResolvedValue(publishing)

      const result = await service.remove(1)
      expect(result).toEqual(publishing)
      expect(mockPublishingRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockPublishingRepository.remove).toHaveBeenCalledWith(publishing)
    })

    it('should throw a 404 error if publishing to delete is not found', async () => {
      mockPublishingRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(999)).rejects.toThrow(HttpException)
      expect(mockPublishingRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})

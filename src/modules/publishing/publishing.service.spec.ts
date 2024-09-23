/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PublishingService } from './publishing.service'
import { Publishing } from './entities/publishing.entity'

describe('PublishingService', () => {
  let service: PublishingService
  let repository: Repository<Publishing>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingService,
        {
          provide: getRepositoryToken(Publishing),
          useClass: Repository
        }
      ]
    }).compile()

    service = module.get<PublishingService>(PublishingService)
    repository = module.get<Repository<Publishing>>(getRepositoryToken(Publishing))
  })

  describe('findAll', () => {
    it('should return an array of publishing', async () => {
      const mockPublishing = [new Publishing()]
      jest.spyOn(repository, 'find').mockResolvedValue(mockPublishing)

      const result = await service.findAll()
      expect(result).toEqual(mockPublishing)
    })

    it('should throw a NOT_FOUND exception if no publishing is found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([])

      await expect(service.findAll()).rejects.toThrow(HttpException)
      await expect(service.findAll()).rejects.toThrow('Failed to retrieve publishing')
    })
  })

  describe('findOne', () => {
    it('should return a publishing by id', async () => {
      const mockPublishing = new Publishing()
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(mockPublishing)

      const result = await service.findOne(1)
      expect(result).toEqual(mockPublishing)
    })

    it('should throw a NOT_FOUND exception if the publishing is not found', async () => {
      jest.spyOn(repository, 'findOneByOrFail').mockRejectedValue(new Error())

      await expect(service.findOne(1)).rejects.toThrow(HttpException)
      await expect(service.findOne(1)).rejects.toThrow('Publishing not found')
    })
  })

  describe('remove', () => {
    it('should remove and return the publishing', async () => {
      const mockPublishing = new Publishing()
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockPublishing)
      jest.spyOn(repository, 'remove').mockResolvedValue(mockPublishing)

      const result = await service.remove(1)
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(repository.remove).toHaveBeenCalledWith(mockPublishing)
      expect(result).toEqual(mockPublishing)
    })

    it('should throw a NOT_FOUND exception if the publishing does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)

      await expect(service.remove(1)).rejects.toThrow(HttpException)
      await expect(service.remove(1)).rejects.toThrow('Publishing not found')
    })
  })

  describe('save', () => {
    it('should save and return the publishing', async () => {
      const mockPublishing = new Publishing()
      jest.spyOn(repository, 'save').mockResolvedValue(mockPublishing)

      const result = await service.save(mockPublishing)
      expect(repository.save).toHaveBeenCalledWith(mockPublishing)
      expect(result).toEqual(mockPublishing)
    })
  })
})

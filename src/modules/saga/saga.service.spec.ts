/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { SagaService } from './saga.service'
import { Saga } from './entities/saga.entity'
import { type CreateSagaDto } from './dto/create-saga.dto'
import { type UpdateSagaDto } from './dto/update-saga.dto'

describe('SagaService', () => {
  let service: SagaService
  let sagaRepository: Repository<Saga>

  const mockSagaRepository = {
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
        SagaService,
        {
          provide: getRepositoryToken(Saga),
          useValue: mockSagaRepository
        }
      ]
    }).compile()

    service = module.get<SagaService>(SagaService)
    sagaRepository = module.get<Repository<Saga>>(getRepositoryToken(Saga))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should successfully create and return a saga', async () => {
      const createSagaDto: CreateSagaDto = {
        title: 'Harry Potter',
        description: 'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling.',
        nbVolumes: 7
      }
      const savedSaga = { id: 1, ...createSagaDto }

      mockSagaRepository.create.mockReturnValue(savedSaga)
      mockSagaRepository.save.mockResolvedValue(savedSaga)

      const result = await service.create(createSagaDto)
      expect(result).toEqual(savedSaga)
      expect(mockSagaRepository.create).toHaveBeenCalledWith(createSagaDto)
      expect(mockSagaRepository.save).toHaveBeenCalledWith(savedSaga)
    })

    it('should throw an error when create fails', async () => {
      const createSagaDto: CreateSagaDto = {
        title: 'Harry Potter',
        description: 'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling.',
        nbVolumes: 7
      }
      mockSagaRepository.save.mockRejectedValue(new Error())

      await expect(service.create(createSagaDto)).rejects.toThrow(HttpException)
      expect(mockSagaRepository.save).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe('findAll', () => {
    it('should return all sagas', async () => {
      const sagas = [
        { id: 1, title: 'Harry Potter', description: 'A series of fantasy novels', nbVolumes: 7 },
        { id: 2, title: 'The Lord of the Rings', description: 'An epic high-fantasy novel', nbVolumes: 3 }
      ]
      mockSagaRepository.find.mockResolvedValue(sagas)

      const result = await service.findAll()
      expect(result).toEqual(sagas)
      expect(mockSagaRepository.find).toHaveBeenCalled()
    })

    it('should throw an error when no sagas are found', async () => {
      mockSagaRepository.find.mockResolvedValue([])

      await expect(service.findAll()).rejects.toThrow(HttpException)
      expect(mockSagaRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a saga by id', async () => {
      const saga = { id: 1, title: 'Harry Potter', description: 'A series of fantasy novels', nbVolumes: 7 }
      mockSagaRepository.findOneByOrFail.mockResolvedValue(saga)

      const result = await service.findOne(1)
      expect(result).toEqual(saga)
      expect(mockSagaRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 })
    })

    it('should throw a 404 error if saga is not found', async () => {
      mockSagaRepository.findOneByOrFail.mockRejectedValue(new Error())

      await expect(service.findOne(999)).rejects.toThrow(HttpException)
      expect(mockSagaRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('update', () => {
    it('should update and return a saga', async () => {
      const updateSagaDto: UpdateSagaDto = { title: 'The Hobbit' }
      const existingSaga = { id: 1, title: 'Harry Potter', description: 'A series of fantasy novels', nbVolumes: 7 }
      const updatedSaga = { ...existingSaga, ...updateSagaDto }

      mockSagaRepository.findOneBy.mockResolvedValue(existingSaga)
      mockSagaRepository.merge.mockImplementation((existing, update) => {
        Object.assign(existing, update)
        return existing
      })
      mockSagaRepository.save.mockResolvedValue(updatedSaga)

      const result = await service.update(1, updateSagaDto)

      expect(result).toEqual(updatedSaga)
      expect(mockSagaRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockSagaRepository.merge).toHaveBeenCalledWith(existingSaga, updateSagaDto)
      expect(mockSagaRepository.save).toHaveBeenCalledWith(updatedSaga)
    })

    it('should throw a 404 error if saga is not found', async () => {
      mockSagaRepository.findOneBy.mockResolvedValue(null)

      await expect(service.update(999, { title: 'The Hobbit' })).rejects.toThrow(HttpException)
      expect(mockSagaRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('remove', () => {
    it('should remove and return a saga', async () => {
      const saga = { id: 1, title: 'Harry Potter', description: 'A series of fantasy novels', nbVolumes: 7 }
      mockSagaRepository.findOneBy.mockResolvedValue(saga)
      mockSagaRepository.remove.mockResolvedValue(saga)

      const result = await service.remove(1)
      expect(result).toEqual(saga)
      expect(mockSagaRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockSagaRepository.remove).toHaveBeenCalledWith(saga)
    })

    it('should throw a 404 error if saga to delete is not found', async () => {
      mockSagaRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(999)).rejects.toThrow(HttpException)
      expect(mockSagaRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})

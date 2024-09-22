import { Test, type TestingModule } from '@nestjs/testing'
import { GenreService } from './genre.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Genre } from './entities/genre.entity'
import { type Repository } from 'typeorm'
import { HttpException, HttpStatus } from '@nestjs/common'
import { type CreateGenreDto } from './dto/create-genre.dto'
import { type UpdateGenreDto } from './dto/update-genre.dto'
import { mock } from 'node:test'

// Mock du repository Genre
const mockGenreRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneByOrFail: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn()
}

describe('GenreService', () => {
  let service: GenreService
  let repository: Repository<Genre>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository
        }
      ]
    }).compile()

    service = module.get<GenreService>(GenreService)
    repository = module.get<Repository<Genre>>(getRepositoryToken(Genre))
  })

  afterEach(() => {
    jest.clearAllMocks() // Nettoyer les mocks après chaque test
  })

  describe('create', () => {
    it('should successfully create and return a genre', async () => {
      const createGenreDto: CreateGenreDto = { genre: 'Science fiction' }
      const savedGenre = { id: 1, genre: 'Science fiction' }

      mockGenreRepository.create.mockReturnValue(createGenreDto)
      mockGenreRepository.save.mockResolvedValue(savedGenre)

      const result = await service.create(createGenreDto)

      expect(mockGenreRepository.create).toHaveBeenCalledWith(createGenreDto)
      expect(mockGenreRepository.save).toHaveBeenCalledWith(createGenreDto)
      expect(result).toEqual(savedGenre)
    })

    it('should throw an internal server error when save fails', async () => {
      mockGenreRepository.save.mockRejectedValue(new Error())

      await expect(service.create({ genre: 'Fantasy' })).rejects.toThrow(
        new HttpException('Failed to create genre', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genres = [{ id: 1, genre: 'Fantasy' }, { id: 2, genre: 'Horror' }]
      mockGenreRepository.find.mockResolvedValue(genres)

      const result = await service.findAll()

      expect(mockGenreRepository.find).toHaveBeenCalled()
      expect(result).toEqual(genres)
    })

    it('should throw an internal server error when find fails', async () => {
      mockGenreRepository.find.mockRejectedValue(new Error())

      await expect(service.findAll()).rejects.toThrow(
        new HttpException('Failed to retrieve genres', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('findOne', () => {
    it('should return a genre when found', async () => {
      const genre = { id: 1, genre: 'Romance' }
      mockGenreRepository.findOneByOrFail.mockResolvedValue(genre)

      const result = await service.findOne(1)

      expect(mockGenreRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 })
      expect(result).toEqual(genre)
    })

    it('should throw a 404 error when genre is not found', async () => {
      mockGenreRepository.findOneByOrFail.mockRejectedValue(new Error())

      await expect(service.findOne(999)).rejects.toThrow(
        new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      )
    })
  })

  describe('update', () => {
    it('should update and return the updated genre', async () => {
      const existingGenre = { id: 1, genre: 'Thriller' }
      const updateGenreDto: UpdateGenreDto = { genre: 'Updated Thriller' }
      const updatedGenre = { ...existingGenre, ...updateGenreDto }

      mockGenreRepository.findOneBy.mockResolvedValue(existingGenre)
      mockGenreRepository.save.mockResolvedValue(updatedGenre)
      mockGenreRepository.merge.mockReturnValue((existing: any, update: any) => {
        Object.assign(existing, update)
        return existing
      })

      const result = await service.update(1, updateGenreDto)

      expect(result).toEqual(updatedGenre)
      expect(mockGenreRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockGenreRepository.merge).toHaveBeenCalledWith(existingGenre, updateGenreDto)
    })

    it('should throw a 404 error if genre is not found', async () => {
      mockGenreRepository.findOneBy.mockResolvedValue(null)

      await expect(service.update(999, { genre: 'Nonexistent' })).rejects.toThrow(
        new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      )
    })

    it('should throw an internal server error when update fails', async () => {
      mockGenreRepository.findOneBy.mockResolvedValue({ id: 1, genre: 'Action' })
      mockGenreRepository.save.mockRejectedValue(new Error())

      await expect(service.update(1, { genre: 'Action Updated' })).rejects.toThrow(
        new HttpException('Failed to update genre', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('remove', () => {
    it('should remove and return the removed genre', async () => {
      const genre = { id: 1, genre: 'Drama' }

      mockGenreRepository.findOneBy.mockResolvedValue(genre)
      mockGenreRepository.remove.mockResolvedValue(genre)

      const result = await service.remove(1)

      expect(mockGenreRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockGenreRepository.remove).toHaveBeenCalledWith(genre)
      expect(result).toEqual(genre)
    })

    it('should throw a 404 error if genre is not found', async () => {
      mockGenreRepository.findOneBy.mockResolvedValue(null)

      await expect(service.remove(999)).rejects.toThrow(
        new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      )
    })

    it('should throw an internal server error when remove fails', async () => {
      mockGenreRepository.findOneBy.mockResolvedValue({ id: 1, genre: 'Horror' })
      mockGenreRepository.remove.mockRejectedValue(new Error())

      await expect(service.remove(1)).rejects.toThrow(
        new HttpException('Failed to delete genre', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})

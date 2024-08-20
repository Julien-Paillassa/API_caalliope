import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateGenreDto } from './dto/create-genre.dto'
import { type UpdateGenreDto } from './dto/update-genre.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Genre } from './entities/genre.entity'
import { Repository } from 'typeorm'

@Injectable()
export class GenreService {
  private readonly logger = new Logger(AbortController.name)

  constructor (
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {}

  async create (createGenreDto: CreateGenreDto): Promise<Genre> {
    try {
      const genre = this.genreRepository.create(createGenreDto)
      return await this.genreRepository.save(genre)
    } catch (error) {
      this.logger.error('Error creating genre', error.stack)
      throw new HttpException('Failed to create genre', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll (): Promise<Genre[]> {
    try {
      return await this.genreRepository.find()
    } catch (error) {
      this.logger.error('Error finding all genres', error.stack)
      throw new HttpException('Failed to retrieve genres', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Genre | null> {
    try {
      const genre = await this.genreRepository.findOneByOrFail({ id })
      return genre
    } catch (error) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    try {
      const existingGenre = await this.genreRepository.findOneBy({ id })

      if (existingGenre == null) {
        throw new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      }

      this.genreRepository.merge(existingGenre, updateGenreDto)
      return await this.genreRepository.save(existingGenre)
    } catch (error) {
      this.logger.error('Error updating genre', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update genre', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<Genre> {
    try {
      const genre = await this.genreRepository.findOneBy({ id })

      if (genre == null) {
        throw new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      }

      return await this.genreRepository.remove(genre)
    } catch (error) {
      this.logger.error('Error deleting genre', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to delete genre', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

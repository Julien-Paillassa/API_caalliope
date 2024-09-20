import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateAuthorDto } from './dto/create-author.dto'
import { type UpdateAuthorDto } from './dto/update-author.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from './entities/author.entity'
import { Repository } from 'typeorm'
import { AuthorFactory } from './author.factory'

@Injectable()
export class AuthorService {
  private readonly logger = new Logger(AuthorService.name)

  constructor (
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>
  ) {}

  async create (createAuthorDto: CreateAuthorDto): Promise<Author> {
    try {
      const author = this.authorRepository.create(createAuthorDto)
      return await this.authorRepository.save(author)
    } catch (error) {
      this.logger.error('Error creating author', error.stack)
      throw new HttpException('Failed to create author', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll (): Promise<Author[]> {
    try {
      return await this.authorRepository.find({
        relations: ['avatar']
      })
    } catch (error) {
      this.logger.error('Error finding all authors', error.stack)
      throw new HttpException('Failed to retrieve authors', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Author | null> {
    try {
      // const author = await this.authorRepository.findOneByOrFail({ id })
      const author = await this.authorRepository.findOneOrFail(
        {
          where: { id },
          relations: ['avatar']
        }
      )
      return author
    } catch (error) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    try {
      const existingAuthor = await this.authorRepository.findOneBy({ id })

      if (existingAuthor == null) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND)
      }

      this.authorRepository.merge(existingAuthor, updateAuthorDto)
      return await this.authorRepository.save(existingAuthor)
    } catch (error) {
      this.logger.error('Error updating author', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update author', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<Author> {
    try {
      const author = await this.authorRepository.findOneBy({ id })

      if (author == null) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND)
      }

      return await this.authorRepository.remove(author)
    } catch (error) {
      this.logger.error('Error removing author', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to remove author', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createOrFindAuthor (createAuthorDto: { fullName: string }): Promise<Author> {
    let author = await this.authorRepository.findOne({ where: { fullName: createAuthorDto.fullName } })

    if (author == null) {
      author = this.authorRepository.create(AuthorFactory.createDefaultAuthor({ fullName: createAuthorDto.fullName }))
      await this.authorRepository.save(author)
    }

    return author
  }
}

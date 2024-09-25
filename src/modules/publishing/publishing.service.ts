/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type UpdatePublishingDto } from './dto/update-publishing.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Publishing } from './entities/publishing.entity'
import { Repository, In } from 'typeorm'
import { Status } from '../admin/entities/status.enum'
import { PublishingFactory } from './publishing.factory'
import { Book } from '../book/entities/book.entity'

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name)

  constructor (
    @InjectRepository(Publishing)
    private readonly publishingRepository: Repository<Publishing>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) { }

  async findAll (): Promise<Publishing[]> {
    try {
      const allPublising = await this.publishingRepository.find()

      if (allPublising.length === 0) {
        throw new HttpException('No formats found', HttpStatus.NOT_FOUND)
      }

      return allPublising
    } catch (error) {
      this.logger.error('Error finding all publishing', error.stack)
      throw new HttpException('Failed to retrieve publishing', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Publishing | null> {
    try {
      const publishing = await this.publishingRepository.findOneByOrFail({ id })
      return publishing
    } catch (error) {
      throw new HttpException('Publishing not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updatePublishingDto: UpdatePublishingDto): Promise<Publishing> {
    try {
      const existingPublishing = await this.publishingRepository.findOneBy({ id })

      if (existingPublishing == null) {
        throw new HttpException('Publishing not found', HttpStatus.NOT_FOUND)
      }

      const formatedUpdateDto = PublishingFactory.createDefaultPublishing({
        ...updatePublishingDto,
        format: undefined,
        nbPages: parseInt(updatePublishingDto.nbPages || '0')
      })

      this.publishingRepository.merge(existingPublishing, formatedUpdateDto)
      return await this.publishingRepository.save(existingPublishing)
    } catch (error) {
      this.logger.error('Error updating publishing', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update publishing', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<Publishing> {
    try {
      const publishing = await this.publishingRepository.findOneBy({ id })

      if (publishing == null) {
        throw new HttpException('Publishing not found', HttpStatus.NOT_FOUND)
      }

      return await this.publishingRepository.remove(publishing)
    } catch (error) {
      this.logger.error('Error removing publishing', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to remove publishing', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createPublishing (createPublishingDto: Partial<Publishing>): Promise<Publishing> {
    const publishing = this.publishingRepository.create({
      label: createPublishingDto.label,
      language: createPublishingDto.language || 'No language provided yet',
      isbn: createPublishingDto.isbn,
      nbPages: createPublishingDto.nbPages,
      publicationDate: createPublishingDto.publicationDate,
      book: createPublishingDto.book,
      format: createPublishingDto.format,
      status: Status.WAITING
    })

    return await this.publishingRepository.save(publishing)
  }

  async save (publishing: Publishing): Promise<Publishing> {
    return await this.publishingRepository.save(publishing)
  }

  async findRecentBooks (): Promise<any> {
    try {
      const data = await this.publishingRepository.createQueryBuilder('publishing')
        .leftJoinAndSelect('publishing.book', 'book')
        .where('publishing.publicationDate LIKE :year2021', { year2021: '%2021%' })
        .orWhere('publishing.publicationDate LIKE :year2022', { year2022: '%2022%' })
        .orWhere('publishing.publicationDate LIKE :year2023', { year2023: '%2023%' })
        .orWhere('publishing.publicationDate LIKE :year2024', { year2024: '%2024%' })
        .groupBy('book.id')
        .addGroupBy('publishing.id')
        .orderBy('MAX(publishing.publicationDate)', 'DESC')
        .limit(10)
        .getMany()

      this.logger.log(data.map(publishing => publishing.book.id), 'publishing here my friend')

      const bookIds = data.map(publishing => publishing.book.id)

      const books = await this.bookRepository.find({
        where: { id: In(bookIds) },
        relations: ['cover', 'author', 'comment', 'genre', 'userBook', 'publishing', 'publishing.format']
      })
      return books
    } catch (error) {
      this.logger.error('Error finding recent books', error.stack)
      throw new HttpException('Failed to retrieve recent books', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

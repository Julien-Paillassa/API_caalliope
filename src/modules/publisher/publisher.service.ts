import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreatePublisherDto } from './dto/create-publisher.dto'
import { type UpdatePublisherDto } from './dto/update-publisher.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Publisher } from './entities/publisher.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PublisherService {
  private readonly logger = new Logger(AbortController.name)

  constructor (
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>
  ) {}

  async create (createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    try {
      const publisher = this.publisherRepository.create(createPublisherDto)
      return await this.publisherRepository.save(publisher)
    } catch (error) {
      this.logger.error('Error creating publisher', error.stack)
      throw new HttpException('Failed to create publisher', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll (): Promise<Publisher[]> {
    try {
      return await this.publisherRepository.find()
    } catch (error) {
      this.logger.error('Error finding all publishers', error.stack)
      throw new HttpException('Failed to retrieve publishers', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Publisher | null> {
    try {
      const publisher = await this.publisherRepository.findOneByOrFail({ id })
      return publisher
    } catch (error) {
      throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updatePublisherDto: UpdatePublisherDto): Promise<Publisher> {
    try {
      const existingPublisher = await this.publisherRepository.findOneBy({ id })

      if (existingPublisher == null) {
        throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND)
      }

      this.publisherRepository.merge(existingPublisher, updatePublisherDto)
      return await this.publisherRepository.save(existingPublisher)
    } catch (error) {
      this.logger.error('Error updating publisher', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update publisher', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<Publisher> {
    try {
      const publisher = await this.publisherRepository.findOneBy({ id })

      if (publisher == null) {
        throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND)
      }

      return await this.publisherRepository.remove(publisher)
    } catch (error) {
      this.logger.error('Error deleting publisher', error.stack)
      throw new HttpException('Failed to delete publisher', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

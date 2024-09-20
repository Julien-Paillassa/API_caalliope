import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreatePublishingDto } from './dto/create-publishing.dto'
import { type UpdatePublishingDto } from './dto/update-publishing.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Publishing } from './entities/publishing.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name)

  constructor (
    @InjectRepository(Publishing)
    private readonly publishingRepository: Repository<Publishing>
  ) {}

  async create (createPublishingDto: CreatePublishingDto): Promise<Publishing> {
    try {
      const publishing = this.publishingRepository.create(createPublishingDto)
      return await this.publishingRepository.save(publishing)
    } catch (error) {
      this.logger.error('Error creating publishing', error.stack)
      throw new HttpException('Failed to create publishing', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

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

      this.publishingRepository.merge(existingPublishing, updatePublishingDto)
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
}

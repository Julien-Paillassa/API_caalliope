import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateFormatDto } from './dto/create-format.dto'
import { type UpdateFormatDto } from './dto/update-format.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Format } from './entities/format.entity'
import { Repository } from 'typeorm'

@Injectable()
export class FormatService {
  private readonly logger = new Logger(FormatService.name)

  constructor (
    @InjectRepository(Format)
    private readonly formatRepository: Repository<Format>
  ) {}

  async create (createFormatDto: CreateFormatDto): Promise<Format> {
    try {
      const format = this.formatRepository.create(createFormatDto)
      return await this.formatRepository.save(format)
    } catch (error) {
      this.logger.error('Error creating format', error.stack)
      throw new HttpException('Failed to create format', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll (): Promise<Format[]> {
    try {
      const allFormats = await this.formatRepository.find()

      if (allFormats.length === 0) {
        throw new HttpException('No formats found', HttpStatus.NOT_FOUND)
      }

      return allFormats
    } catch (error) {
      this.logger.error('Error finding all formats', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('No formats found', HttpStatus.NOT_FOUND)
      }
      throw new HttpException('Failed to retrieve formats', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Format | null> {
    try {
      const format = await this.formatRepository.findOneByOrFail({ id })
      return format
    } catch (error) {
      throw new HttpException('Format not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updateFormatDto: UpdateFormatDto): Promise<Format> {
    try {
      const existingFormat = await this.formatRepository.findOneBy({ id })

      if (existingFormat == null) {
        throw new HttpException('Format not found', HttpStatus.NOT_FOUND)
      }

      this.formatRepository.merge(existingFormat, updateFormatDto)
      return await this.formatRepository.save(existingFormat)
    } catch (error) {
      this.logger.error('Error updating format', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update format', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<Format> {
    try {
      const format = await this.formatRepository.findOneBy({ id })

      if (format == null) {
        throw new HttpException('Format not found', HttpStatus.NOT_FOUND)
      }

      return await this.formatRepository.remove(format)
    } catch (error) {
      this.logger.error('Error removing format', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to remove format', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createOrFindFormat (createFormatDto: Partial<Format>): Promise<Format> {
    let format = await this.formatRepository.findOne({ where: { type: createFormatDto?.type } })

    if (format == null) {
      format = this.formatRepository.create({ type: createFormatDto.type, language: createFormatDto.language })
      await this.formatRepository.save(format)
    }

    return format
  }
}

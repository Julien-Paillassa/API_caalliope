import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Book } from '../book/entities/book.entity'
import { Repository } from 'typeorm'
import { Cover } from './entities/cover.entity'

@Injectable()
export class CoverService {
  private readonly logger = new Logger(CoverService.name)

  constructor (
    @InjectRepository(Cover)
    private readonly coverRepository: Repository<Cover>,
    @InjectRepository(Book)
    private readonly BookRepository: Repository<Book>
  ) {}

  async saveCover (filename: string, book?: Book): Promise<any> {
    try {
      if (book !== undefined) {
        const cover = this.coverRepository.create({
          filename,
          book
        })

        return await this.coverRepository.save(cover)
      }
    } catch (error) {
      this.logger.error('Error creating cover', error.stack)
      throw new HttpException('Failed to save cover', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByBookId (id: number): Promise<any> {
    try {
      const cover = await this.coverRepository.findOne({
        where: { book: { id } },
        relations: ['book']
      })
      if (cover === null) {
        throw new HttpException('Cover not found', HttpStatus.NOT_FOUND)
      }

      return cover
    } catch (error) {
      this.logger.error('Error finding cover by book ID', error.stack)
      throw new HttpException('Failed to find book cover', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateCover (cover: any): Promise<any> {
    try {
      return await this.coverRepository.save(cover)
    } catch (error) {
      this.logger.error('Error updating cover', error.stack)
      throw new HttpException('Failed to update cover', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCover (id: number): Promise<Cover> {
    try {
      const cover = await this.coverRepository.findOneBy({ id })
      if (cover === null) {
        throw new HttpException('Cover not found', HttpStatus.NOT_FOUND)
      }

      return await this.coverRepository.remove(cover)
    } catch (error) {
      this.logger.error('Error deleting cover', error.stack)
      throw new HttpException('Failed to delete cover', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

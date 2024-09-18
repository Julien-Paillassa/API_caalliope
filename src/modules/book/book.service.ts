import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common'
import {type UpdateBookDto} from './dto/update-book.dto'
import {InjectRepository} from '@nestjs/typeorm'
import {ILike, Repository} from 'typeorm';
import {Book} from './entities/book.entity'
import {Status} from '../admin/entities/status.enum'

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name)

  constructor (
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}

  async createBook (createBookDto: Partial<Book>): Promise<Book> {
    const book = this.bookRepository.create({
      title: createBookDto.title,
      summary: createBookDto.summary,
      publicationDate: createBookDto.publicationDate,
      author: createBookDto.author
    })

    return await this.bookRepository.save(book)
  }

  async save (book: Book) {
    return await this.bookRepository.save(book)
  }

  async findAll (): Promise<Book[]> {
    try {
      return await this.bookRepository.createQueryBuilder('book')
        .leftJoinAndSelect('book.cover', 'cover')
        .leftJoin('book.publishing', 'publishing')
        .where('publishing.id IS NOT NULL')
        .andWhere('cover.id IS NOT NULL')
        .select(['book.id', 'cover'])
        .getMany()
    } catch (error) {
      this.logger.error('Error finding all books', error.stack)
      throw new HttpException('Failed to retrieve books', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Book | null> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id },
        relations: [
          'cover',
          'author',
          'comment',
          'genre',
          'userBook',
          'publishing'
        ]
      })
      return book
    } catch (error) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND)
    }
  }

  async getBooksByGenre(genre: string) {
    try {
      this.logger.log(`Finding books by genre ${genre}`)
      return await this.bookRepository.find({
        relations: ['cover', 'publishing'],
        where: {
          genre: {genre: ILike(`%${genre}%`)}
        }
      })
    } catch (error) {
      this.logger.error('Error finding books by genre', error.stack)
      throw new HttpException('Failed to retrieve books by genre', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update (id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      const existingBook = await this.bookRepository.findOneBy({ id })

      if (existingBook == null) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND)
      }

      this.bookRepository.merge(existingBook, updateBookDto as unknown as Book)
      return await this.bookRepository.save(existingBook)
    } catch (error) {
      this.logger.error(`Error updating book with id ${id}`, error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
    }
    throw new HttpException('Failed to update book', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  async remove (id: number): Promise<Book> {
    try {
      const existingBook = await this.bookRepository.findOneBy({ id })

      if (existingBook == null) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND)
      }

      return await this.bookRepository.remove(existingBook)
    } catch (error) {
      this.logger.error('Error deleting book', error.stack)
      throw new HttpException('Failed to delete book', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findWaiting (): Promise<Book[]> {
    try {
      return await this.bookRepository.find({
        relations: ['cover', 'publishing'],
        where: {
          status: Status.WAITING
        }
      })
    } catch (error) {
      this.logger.error('Error finding books waitings', error.stack)
      throw new HttpException('Failed to retrieve books waitings', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

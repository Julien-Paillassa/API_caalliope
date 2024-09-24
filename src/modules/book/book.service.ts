import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type UpdateBookDto } from './dto/update-book.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository, MoreThanOrEqual } from 'typeorm'
import { Book } from './entities/book.entity'
import { Status } from '../admin/entities/status.enum'

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

  async save (book: Book): Promise<Book> {
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
          .getMany();
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
          'publishing',
          'publishing.format'
        ]
      })
      return book
    } catch (error) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND)
    }
  }

  async getBooksByGenre (genre: string): Promise<Book[]> {
    try {
      this.logger.log(`Finding books by genre ${genre}`)
      return await this.bookRepository.find({
        relations: ['cover', 'publishing'],
        where: {
          genre: { genre: ILike(`%${genre}%`) }
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

      if (updateBookDto.rating !== undefined) {
        const totalRatings = existingBook.ratingNumber * existingBook.rating;
        const newTotalRatings = totalRatings + updateBookDto.rating;
        const newRatingNumber = existingBook.ratingNumber + 1;

        existingBook.rating = Math.round(newTotalRatings / newRatingNumber);
        existingBook.ratingNumber = newRatingNumber;

        this.logger.log(`Updated rating for book ${id} to ${existingBook.rating}`);
      }

      const updatedBook = this.bookRepository.merge(existingBook, updateBookDto as unknown as Book)
      this.logger.log(existingBook.rating, updatedBook.rating)
      return await this.bookRepository.save(updatedBook)
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

  async findBooksByTitleOrAuthor (searchTerm: string): Promise<Book[]> {
    try {
      console.log(searchTerm)
      return await this.bookRepository.find({
        relations: ['author', 'cover', 'publishing'],
        where: [
          { title: ILike(`%${searchTerm}%`) }, // Recherche par titre
          { author: { firstName: ILike(`%${searchTerm}%`) } }, // Recherche par prénom de l'auteur
          { author: { lastName: ILike(`%${searchTerm}%`) } } // Recherche par nom de l'auteur
        ]
      })
    } catch (error) {
      this.logger.error(`Error finding books by title or author: ${searchTerm}`, error.stack)
      throw new HttpException('Failed to retrieve books by title or author', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findPopularBooks (minRating: number): Promise<Book[]> {
    try {
      return await this.bookRepository.find({
        relations: ['cover', 'author', 'publishing'],
        where: {
          rating: MoreThanOrEqual(minRating)
        }
      })
    } catch (error) {
      this.logger.error(`Error finding books with rating >= ${minRating}`, error.stack)
      throw new HttpException('Failed to retrieve books by rating', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

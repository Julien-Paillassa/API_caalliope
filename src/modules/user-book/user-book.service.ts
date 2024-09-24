import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserBook } from './entities/user-book.entity'
import { Repository } from 'typeorm'
import { type CreateUserBookDto } from './dto/create-user-book.dto'
import { type UpdateUserBookDto } from './dto/update-user-book.dto'
import { type UserBookStatus } from './entities/user-book-status.enum'

@Injectable()
export class UserBookService {
  private readonly logger = new Logger(AbortController.name)
  private readonly USER_BOOK_STATUS: UserBookStatus

  constructor (
    @InjectRepository(UserBook)
    private readonly userBookRepository: Repository<UserBook>
  ) {}

  async addBookToUser (createUserBookDto: CreateUserBookDto): Promise<UserBook> {
    try {
      const userBook = this.userBookRepository.create({
        user: { id: createUserBookDto.userId },
        book: { id: createUserBookDto.bookId },
        status: createUserBookDto.status
      })
      return await this.userBookRepository.save(userBook)
    } catch (error) {
      this.logger.error('Error adding book to user', error.stack)
      throw new HttpException('Failed to add book to user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateBookStatus (userId: number, bookId: number, updateUserBookDto: UpdateUserBookDto): Promise<UserBook> {
    try {
      if (updateUserBookDto.status === 'notOwned') {
        await this.userBookRepository.delete({
          user: { id: userId },
          book: { id: bookId }
        })
        return {} as UserBook
      }
      const userBook = await this.userBookRepository.findOne({
        where: { user: { id: userId }, book: { id: bookId } }
      })

      if (userBook != null && updateUserBookDto.status != null) {
        userBook.status = updateUserBookDto.status
        return await this.userBookRepository.save(userBook)
      }

      throw new HttpException('UserBook not found', HttpStatus.NOT_FOUND)
    } catch (error) {
      this.logger.error('Error updating book status', error.stack)
      throw new HttpException('Failed to update book status', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getBooksForUser (userId: number): Promise<UserBook[]> {
    try {
      return await this.userBookRepository.find({
        where: { user: { id: userId } },
        relations: ['book']
      })
    } catch (error) {
      this.logger.error('Error getting books for user', error.stack)
      throw new HttpException('Failed to get books for user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

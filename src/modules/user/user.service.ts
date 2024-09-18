import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateUserDto } from './dto/create-user.dto'
import { type UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { BookService } from '../book/book.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(AbortController.name)

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bookService: BookService
  ) {}

  async create (createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto)
      return await this.userRepository.save(user)
    } catch (error) {
      this.logger.error('Error creating user', error.stack)
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll (): Promise<User[]> {
    try {
      return await this.userRepository.find({
        relations: ['avatar']
      })
    } catch (error) {
      this.logger.error('Error finding all users', error.stack)
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<any | null> {
    try {
      this.logger.log(`Finding user with id ${id}`)
      const user = await this.userRepository.findOneOrFail(
        {
          where: { id },
          relations: ['avatar', 'userBook']
        })

      const userWithBooks = await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['userBook', 'userBook.book', 'userBook.book.cover']
      });

      const userBook = userWithBooks.userBook.map((userBook) => ({
        book: {
          id: userBook.book.id,
          title: userBook.book.title,
          cover: userBook.book.cover,
        },
        status: userBook.status
      }));

      if (user.role === 'admin') {
        const bookWaiting = await this.bookService.findWaiting()
        return { ...user, bookWaiting }
      } else {
        return { ...user, userBook }
      }
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async findOneByEmail (email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ email })
      return user
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({ id })

      if (existingUser == null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      const updatedUser = this.userRepository.merge(existingUser, updateUserDto)
      return await this.userRepository.save(updatedUser)
    } catch (error) {
      this.logger.error(`Error updating user with id ${id}`, error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({ id })

      if (existingUser == null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      return await this.userRepository.remove(existingUser)
    } catch (error) {
      this.logger.error(`Error removing user with id ${id}`, error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to remove user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

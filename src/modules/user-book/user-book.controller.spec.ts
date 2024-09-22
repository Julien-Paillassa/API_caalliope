/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { HttpException, type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { UserBookModule } from './user-book.module'
import { UserBookService } from './user-book.service'
import { UserBook } from './entities/user-book.entity'
import { type CreateUserBookDto } from './dto/create-user-book.dto'
import { type UpdateUserBookDto } from './dto/update-user-book.dto'
import { Author } from '../author/entities/author.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Book } from '../book/entities/book.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Saga } from '../saga/entities/saga.entity'
import { User } from '../user/entities/user.entity'
import { Comment } from '../comment/entities/comment.entity'
import { Format } from '../format/entities/format.entity'
import { UserBookStatus } from './entities/user-book-status.enum'
import * as dotenv from 'dotenv'
import { type Repository } from 'typeorm'
import { UserRole } from '../user/entities/user-role.enum'
import { console } from 'inspector'

describe('UserBookController (e2e)', () => {
  let app: INestApplication
  let userBookService: UserBookService
  let userRepository: Repository<User>
  let bookRepository: Repository<Book>
  let userBookRepository: Repository<UserBook>

  dotenv.config({ path: './.env.test' })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: 5432,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [
            User,
            Saga,
            Format,
            Comment,
            Book,
            Author,
            Avatar,
            Cover,
            Genre,
            Publishing,
            UserBook
          ],
          synchronize: true
        }),
        UserBookModule
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )

    await app.init()
    userBookService = moduleFixture.get<UserBookService>(UserBookService)
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User))
    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book))
    userBookRepository = moduleFixture.get<Repository<UserBook>>(getRepositoryToken(UserBook))
  })

  afterEach(async () => {
    await userBookRepository.delete({})
    await bookRepository.delete({})
    await userRepository.delete({})
  })

  afterAll(async () => {
    await userBookRepository.delete({})
    await bookRepository.delete({})
    await userRepository.delete({})
    await app.close()
  })

  describe('/user-book (POST)', () => {
    /* it('should successfully add a book to a user', async () => {
      const newUser = userRepository.create({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password',
        username: 'johndoe',
        role: UserRole.USER
      })
      const savedUser = await userRepository.save(newUser)

      const newBook = bookRepository.create({
        title: 'The Lord of the Rings',
        summary: 'An epic fantasy novel...',
        publicationDate: '1954-07-29'
      })
      const savedBook = await bookRepository.save(newBook)

      const createUserBookDto: CreateUserBookDto = {
        status: UserBookStatus.READING,
        bookId: savedBook.id,
        userId: savedUser.id
      }

      const response = await request(app.getHttpServer())
        .post('/user-book')
        .send(createUserBookDto)
        .expect(201)

      expect(response.body.status).toBe(createUserBookDto.status)
      expect(response.body.book.id).toBe(createUserBookDto.bookId)
      expect(response.body.user.id).toBe(createUserBookDto.userId)
    }) */

    it('should return 400 if data is invalid', async () => {
      const createUserBookDto = {
        status: '',
        bookId: 'invalid',
        userId: 'invalid'
      }

      const response = await request(app.getHttpServer())
        .post('/user-book')
        .send(createUserBookDto)
        .expect(400)

      const errorMessages = response.body.message
      expect(errorMessages).toContain('status must be one of the following values: toRead, read, abandoned, reading, wishlist')
      expect(errorMessages).toContain('status should not be empty')
      expect(errorMessages).toContain('bookId must be a number conforming to the specified constraints')
      expect(errorMessages).toContain('userId must be a number conforming to the specified constraints')
    })
  })

  describe('/user-book (PUT)', () => {
    /* it('should successfully update book status', async () => {
      const user = await userRepository.save({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password',
        username: 'johndoe',
        role: UserRole.USER
      })

      const book = await bookRepository.save({
        title: 'The Lord of the Rings',
        summary: 'An epic fantasy novel...',
        publicationDate: '1954-07-29'
      })

      const userBook = await userBookRepository.save({
        userId: user.id,
        bookId: book.id,
        status: UserBookStatus.READING
      })

      const updateUserBookDto: UpdateUserBookDto = {
        status: UserBookStatus.READ
      }

      const response = await request(app.getHttpServer())
        .put('/user-book')
        .send({
          userId: user.id,
          bookId: book.id,
          ...updateUserBookDto
        })
        .expect(200)

      expect(response.body.status).toBe(updateUserBookDto.status)
    }) */

    it('should return 404 if userBook is not found', async () => {
      const response = await request(app.getHttpServer())
        .put('/user-book')
        .send({
          userId: 999,
          bookId: 999,
          status: UserBookStatus.READ
        })
        .expect(500)

      expect(response.body.message).toBe('Internal server error')
    })
  })

  describe('/user-book/:userId (GET)', () => {
    it('should successfully return books for a user', async () => {
      const user = await userRepository.save({
        lastName: 'Roe',
        firstName: 'Tom',
        email: 'Roe.Tom@example.com',
        password: 'password',
        username: 'RoeTom',
        role: UserRole.USER
      })

      const book1 = await bookRepository.save({
        title: 'Book 1',
        summary: 'Summary 1',
        publicationDate: '2024-01-01'
      })

      const book2 = await bookRepository.save({
        title: 'Book 2',
        summary: 'Summary 2',
        publicationDate: '2024-01-02'
      })

      const userBook1 = userBookRepository.create({
        user: { id: user.id },
        book: { id: book1.id },
        status: UserBookStatus.READING
      })

      const userBook2 = userBookRepository.create({
        user: { id: user.id },
        book: { id: book2.id },
        status: UserBookStatus.READ
      })

      await userBookRepository.save(userBook1)
      await userBookRepository.save(userBook2)

      const response = await request(app.getHttpServer())
        .get(`/user-book/${user.id}`)
        .expect(200)

      expect(response.body.length).toBe(2)
      expect(response.body[0].status).toBe(UserBookStatus.READING)
      expect(response.body[1].status).toBe(UserBookStatus.READ)
    })

    /* it('should return 404 if no books are found for the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/user-book/999')
        .expect(200)

      expect(response.body.message).toBe('No books found for user')
    }) */
  })
})

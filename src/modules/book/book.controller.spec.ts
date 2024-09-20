/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { BookModule } from './book.module'
import * as dotenv from 'dotenv'
import { Book } from './entities/book.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Author } from '../author/entities/author.entity'
import { Comment } from '../comment/entities/comment.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { UserBook } from '../user-book/entities/user-book.entity'
import { User } from '../user/entities/user.entity'
import { Saga } from '../saga/entities/saga.entity'
import { Format } from '../format/entities/format.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { type UpdateBookDto } from './dto/update-book.dto'
import { Status } from '../admin/entities/status.enum'

describe('BookController (e2e)', () => {
  let app: INestApplication
  let bookRepository: Repository<Book>
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
        BookModule
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

    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book))
  })

  afterAll(async () => {
    await bookRepository.delete({})
    await app.close()
  })

  describe('/book (POST)', () => {
    it('should successfully create a book', async () => {
      const createBookDto = {
        title: 'The Hobbit',
        summary: 'A hobbit goes on an adventure...',
        publicationDate: '1937-09-21'
      }

      const response = await request(app.getHttpServer())
        .post('/book')
        .send(createBookDto)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Book Created Successfully')
      expect(response.body.data.title).toBe(createBookDto.title)
    })
  })

  describe('/book (GET)', () => {
    it('should return all books', async () => {
      const response = await request(app.getHttpServer()).get('/book').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Books Fetched Successfully')
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('/book/:id (GET)', () => {
    it('should return a single book by id', async () => {
      const book = await bookRepository.save({
        title: 'The Lord of the Rings',
        summary: 'An epic fantasy novel...',
        publicationDate: '1954-07-29'
      })

      const response = await request(app.getHttpServer())
        .get(`/book/${book.id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(book.title)
    })

    it('should return a 404 if book is not found', async () => {
      const response = await request(app.getHttpServer()).get('/book/99999').expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Book not found')
    })
  })

  describe('/book/:id (PATCH)', () => {
    it('should update a book', async () => {
      const book = await bookRepository.save({
        title: 'Old Title',
        summary: 'Old summary...',
        publicationDate: '2000-01-01'
      })

      const updateBookDto: UpdateBookDto = {
        title: 'New Title',
        summary: 'New summary...',
        publicationDate: '2023-01-01',
        status: Status.ACCEPTED
      }

      const response = await request(app.getHttpServer())
        .patch(`/book/${book.id}`)
        .send(updateBookDto)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Book Updated Successfully')
      expect(response.body.data.title).toBe(updateBookDto.title)
    })

    it('should return 404 if book to update is not found', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Nonexistent Title',
        summary: 'Does not exist...',
        publicationDate: '2023-01-01',
        status: Status.ACCEPTED
      }

      const response = await request(app.getHttpServer())
        .patch('/book/99999')
        .send(updateBookDto)
        .expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Book not found')
    })
  })

  describe('/book/:id (DELETE)', () => {
    it('should delete a book', async () => {
      const book = await bookRepository.save({
        title: 'To Be Deleted',
        summary: 'To be deleted summary...',
        publicationDate: '1999-01-01'
      })

      const response = await request(app.getHttpServer())
        .delete(`/book/${book.id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Book Deleted Successfully')

      // Vérifie que le livre n'existe plus
      const findResponse = await request(app.getHttpServer())
        .get(`/book/${book.id}`)
        .expect(200)

      expect(findResponse.body.success).toBe(false)
      expect(findResponse.body.message).toBe('Book not found')
    })

    it('should return 404 if book to delete is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/book/99999').expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Failed to delete book')
    })
  })
})

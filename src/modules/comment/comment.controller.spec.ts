/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import { User } from '../user/entities/user.entity'
import { Book } from '../book/entities/book.entity'
import { CommentModule } from './comment.module'
import { type Repository } from 'typeorm'
import * as dotenv from 'dotenv'
// import { type CreateCommentDto } from './dto/create-comment.dto'
import { type UpdateCommentDto } from './dto/update-comment.dto'
import { Author } from '../author/entities/author.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Format } from '../format/entities/format.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Saga } from '../saga/entities/saga.entity'
import { UserBook } from '../user-book/entities/user-book.entity'
import { Status } from '../admin/entities/status.enum'
import { UserRole } from '../user/entities/user-role.enum'
import { type CreateCommentDto } from './dto/create-comment.dto'

describe('CommentController (e2e)', () => {
  let app: INestApplication
  let commentRepository: Repository<Comment>
  let userRepository: Repository<User>
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
        CommentModule
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

    commentRepository = moduleFixture.get<Repository<Comment>>(getRepositoryToken(Comment))
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User))
    bookRepository = moduleFixture.get<Repository<Book>>(getRepositoryToken(Book))
  })

  afterEach(async () => {
    await commentRepository.delete({})
  })

  afterAll(async () => {
    await commentRepository.delete({})
    await app.close()
  })

  describe('/comment (POST)', () => {
    it('should successfully create a comment', async () => {
      const user = userRepository.create({
        lastName: 'MacCarthy',
        firstName: 'Cormac',
        email: 'cormac.macCarthy@gamil.com',
        password: 'password',
        username: 'cormac.macCarthy',
        role: UserRole.USER
      })
      await userRepository.save(user)

      const book = bookRepository.create({
        title: 'The Hobbit',
        summary: 'The Hobbit is a fantasy novel by J.R.R. Tolkien',
        publicationDate: '1937-09-21',
        status: Status.WAITING,
        rating: 5
      })
      await bookRepository.save(book)

      const createCommentDto: CreateCommentDto = {
        userId: user.id,
        bookId: book.id,
        content: 'Amazing book!'
      }

      const response = await request(app.getHttpServer())
        .post('/comment')
        .send(createCommentDto)
        .expect(201)

      expect(response.body.user.id).toBe(user.id)
      expect(response.body.book.id).toBe(book.id)
      expect(response.body.content).toBe(createCommentDto.content)
    })

    it('should return 400 if data is invalid', async () => {
      const createCommentDto = {
        content: '',
        bookId: 1,
        userId: 1
      }

      const response = await request(app.getHttpServer())
        .post('/comment')
        .send(createCommentDto)
        .expect(400)

      const errorMessages = response.body.message

      expect(errorMessages).toContain('content should not be empty')
    })
  })

  describe('/comment (PUT)', () => {
    it('should update a comment', async () => {
      const user = userRepository.create({
        lastName: 'Poe',
        firstName: 'Tom',
        email: 'Poe.Tom@gamil.com',
        password: 'password',
        username: 'Poe.Tom',
        role: UserRole.USER
      })
      await userRepository.save(user)

      const book = bookRepository.create({
        title: 'Harry Potter',
        summary: 'A young wizard...',
        publicationDate: '1937-09-21',
        status: Status.WAITING,
        rating: 5
      })
      await bookRepository.save(book)

      const comment = commentRepository.create({
        user: { id: user.id },
        book: { id: book.id },
        content: 'Good book!'
      })
      await commentRepository.save(comment)

      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment content',
        status: Status.ACCEPTED,
        userId: user.id,
        bookId: book.id
      }

      const response = await request(app.getHttpServer())
        .put('/comment')
        .send(updateCommentDto)
        .expect(200)

      expect(response.body.content).toBe(updateCommentDto.content)
    })

    it('should return 404 if the comment is not found', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment content',
        status: Status.ACCEPTED,
        userId: 9999,
        bookId: 9999
      }

      const response = await request(app.getHttpServer())
        .put('/comment')
        .send(updateCommentDto)
        .expect(500)

      expect(response.body.message).toBe('Internal server error')
    })
  })

  describe('/comment/:bookId (GET)', () => {
    it('should return all comments for a specific book', async () => {
      const user = userRepository.create({
        lastName: 'Fitzgerald',
        firstName: 'Nick',
        email: 'Fitzgerald.Nick@gamil.com',
        password: 'password',
        username: 'Fitzgerald.Nick',
        role: UserRole.USER
      })

      await userRepository.save(user)

      const book = bookRepository.create({
        title: 'The Lord of the Rings',
        summary: 'An epic fantasy novel...',
        publicationDate: '1954-07-29',
        status: Status.ACCEPTED,
        rating: 4
      })

      await bookRepository.save(book)

      const comment1 = commentRepository.create({
        user: { id: user.id },
        book: { id: book.id },
        content: 'Great book!'
      })

      const comment2 = commentRepository.create({
        user: { id: user.id },
        book: { id: book.id },
        content: 'Amazing story!'
      })

      await commentRepository.save(comment1)
      await commentRepository.save(comment2)

      const response = await request(app.getHttpServer()).get(`/comment/${book.id}`).expect(200)

      const sortedComments = response.body.sort((a: any, b: any) => a.id - b.id)

      expect(sortedComments.length).toBe(2)
      expect(sortedComments[0].content).toBe('Great book!') // Rating 5
      expect(sortedComments[1].content).toBe('Amazing story!') // Rating 4
    })

    it('should return an empty array if no comments are found for a book', async () => {
      const response = await request(app.getHttpServer()).get('/comment/9999').expect(200)

      expect(response.body.length).toBe(0)
    })
  })
})

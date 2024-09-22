/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { AuthorModule } from './author.module'
import * as dotenv from 'dotenv'
import { Saga } from '../saga/entities/saga.entity'
import { Format } from '../format/entities/format.entity'
import { Book } from '../book/entities/book.entity'
import { Comment } from '../comment/entities/comment.entity'
import { Author } from '../author/entities/author.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { UserBook } from '../user-book/entities/user-book.entity'
import { User } from '../user/entities/user.entity'

describe('AuthorController (e2e)', () => {
  let app: INestApplication
  let authorRepository: Repository<Author>
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
        AuthorModule
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

    authorRepository = moduleFixture.get<Repository<Author>>(getRepositoryToken(Author))
  })

  afterAll(async () => {
    await authorRepository.delete({})
    await app.close()
  })

  describe('/author (POST)', () => {
    it('should successfully create an author', async () => {
      const createAuthorDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        birthDate: '1970-01-01'
      }

      const response = await request(app.getHttpServer())
        .post('/author')
        .send(createAuthorDto)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Author Created Successfully')
      expect(response.body.data.firstName).toBe(createAuthorDto.firstName)
    })
  })

  describe('/author (GET)', () => {
    it('should return all authors', async () => {
      const response = await request(app.getHttpServer()).get('/author').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Authors Fetched Successfully')
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('/author/:id (GET)', () => {
    it('should return a single author by id', async () => {
      const author = await authorRepository.save({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        birthDate: '1970-01-01'
      })

      const response = await request(app.getHttpServer())
        .get(`/author/${author.id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.firstName).toBe(author.firstName)
    })

    it('should return a 404 if author is not found', async () => {
      const response = await request(app.getHttpServer()).get('/author/99999').expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Author not found')
    })
  })

  describe('/author/:id (PATCH)', () => {
    it('should update an author', async () => {
      const author = await authorRepository.save({
        firstName: 'Old',
        lastName: 'Name',
        birthDate: '1970-01-01',
        email: 'old.email@example.com' // Ajout de l'email si requis
      })

      const updateAuthorDto = {
        firstName: 'New',
        lastName: 'Name',
        birthDate: '1970-01-01',
        email: 'new.email@example.com' // Si nécessaire
      }

      const response = await request(app.getHttpServer())
        .patch(`/author/${author.id}`)
        .send(updateAuthorDto)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Author Updated Successfully')
      expect(response.body.data.firstName).toBe(updateAuthorDto.firstName)
    })

    it('should return 404 if author to update is not found', async () => {
      const updateAuthorDto = {
        firstName: 'New',
        lastName: 'Name',
        birthDate: '1970-01-01'
      }

      const response = await request(app.getHttpServer())
        .patch('/author/99999')
        .send(updateAuthorDto)
        .expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Author not found')
    })
  })

  describe('/author/:id (DELETE)', () => {
    it('should delete an author', async () => {
      const author = await authorRepository.save({
        firstName: 'To Be Deleted',
        lastName: 'Author',
        birthDate: '1970-01-01',
        email: 'deleted.author@example.com'
      })

      const response = await request(app.getHttpServer())
        .delete(`/author/${author.id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Author Deleted Successfully')

      // Vérifier que l'auteur n'existe plus
      const findResponse = await request(app.getHttpServer())
        .get(`/author/${author.id}`)
        .expect(200)

      expect(findResponse.body.success).toBe(false)
      expect(findResponse.body.message).toBe('Author not found')
    })

    it('should return 404 if author to delete is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/author/99999').expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Author not found')
    })
  })
})

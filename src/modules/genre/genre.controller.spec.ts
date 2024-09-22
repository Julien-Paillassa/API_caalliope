/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { GenreModule } from './genre.module'
import { type Repository } from 'typeorm'
import * as dotenv from 'dotenv'
import { Author } from '../author/entities/author.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Book } from '../book/entities/book.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Saga } from '../saga/entities/saga.entity'
import { UserBook } from '../user-book/entities/user-book.entity'
import { User } from '../user/entities/user.entity'
import { Comment } from '../comment/entities/comment.entity'
import { Format } from '../format/entities/format.entity'

dotenv.config({ path: './.env.test' })

describe('GenreController (e2e)', () => {
  let app: INestApplication
  let genreRepository: Repository<Genre>

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
        GenreModule
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

    genreRepository = moduleFixture.get<Repository<Genre>>(getRepositoryToken(Genre))
  })

  afterAll(async () => {
    await genreRepository.delete({})
    await app.close()
  })

  describe('/genre (POST)', () => {
    it('should successfully create a genre', async () => {
      const createGenreDto = {
        genre: 'Science Fiction'
      }

      const response = await request(app.getHttpServer())
        .post('/genre')
        .send(createGenreDto)
        .expect(201)

      expect(response.body.data.genre).toBe(createGenreDto.genre)
      expect(response.body.success).toBe(true)
    })

    it('should return 400 if data is invalid', async () => {
      const createGenreDto = {
        genre: ''
      }

      const response = await request(app.getHttpServer())
        .post('/genre')
        .send(createGenreDto)
        .expect(400)

      const errorMessages = response.body.message
      expect(errorMessages).toContain('genre should not be empty')
    })
  })

  describe('/genre (GET)', () => {
    it('should return all genres', async () => {
      const genre1 = await genreRepository.save({ genre: 'Fantasy' })
      const genre2 = await genreRepository.save({ genre: 'Horror' })

      const response = await request(app.getHttpServer()).get('/genre').expect(200)

      const sortedGenres = response.body.data.sort((a: any, b: any) => a.id - b.id)

      expect(sortedGenres.length).toBe(3)
      expect(sortedGenres[1].genre).toBe(genre1.genre)
      expect(sortedGenres[2].genre).toBe(genre2.genre)
    })
  })

  describe('/genre/:id (GET)', () => {
    it('should return a genre by id', async () => {
      const genre = await genreRepository.save({ genre: 'Romance' })

      const response = await request(app.getHttpServer())
        .get(`/genre/${genre.id}`)
        .expect(200)

      expect(response.body.data.genre).toBe(genre.genre)
    })

    it('should return 404 if the genre is not found', async () => {
      const response = await request(app.getHttpServer()).get('/genre/9999').expect(200)

      expect(response.body.message).toBe('Genre not found')
    })
  })

  describe('/genre/:id (PATCH)', () => {
    it('should update a genre', async () => {
      const genre = await genreRepository.save({ genre: 'Mystery' })

      const updateGenreDto = {
        genre: 'Thriller'
      }

      const response = await request(app.getHttpServer())
        .patch(`/genre/${genre.id}`)
        .send(updateGenreDto)
        .expect(200)

      expect(response.body.data.genre).toBe(updateGenreDto.genre)
    })

    it('should return 404 if the genre is not found', async () => {
      const updateGenreDto = {
        genre: 'Thriller'
      }

      const response = await request(app.getHttpServer())
        .patch('/genre/9999')
        .send(updateGenreDto)
        .expect(200)

      expect(response.body.message).toBe('Genre not found')
    })
  })

  describe('/genre/:id (DELETE)', () => {
    it('should delete a genre', async () => {
      const genre = await genreRepository.save({ genre: 'Adventure' })

      const response = await request(app.getHttpServer())
        .delete(`/genre/${genre.id}`)
        .expect(200)

      expect(response.body.data.genre).toBe(genre.genre)
      expect(response.body.message).toBe('Genre Deleted Successfully')
    })

    it('should return 404 if the genre is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/genre/9999').expect(200)

      expect(response.body.message).toBe('Genre not found')
    })
  })
})

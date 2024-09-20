/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Saga } from './entities/saga.entity'
import { SagaModule } from './saga.module'
import { type Repository } from 'typeorm'
import * as dotenv from 'dotenv'
import { type CreateSagaDto } from './dto/create-saga.dto'
import { type UpdateSagaDto } from './dto/update-saga.dto'
import { Author } from '../author/entities/author.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Book } from '../book/entities/book.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Format } from '../format/entities/format.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { UserBook } from '../user-book/entities/user-book.entity'
import { User } from '../user/entities/user.entity'
import { Comment } from '../comment/entities/comment.entity'

describe('SagaController (e2e)', () => {
  let app: INestApplication
  let sagaRepository: Repository<Saga>

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
        SagaModule
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

    sagaRepository = moduleFixture.get<Repository<Saga>>(getRepositoryToken(Saga))
  })

  afterAll(async () => {
    await sagaRepository.delete({})
    await app.close()
  })

  describe('/saga (POST)', () => {
    it('should successfully create a saga', async () => {
      const createSagaDto: CreateSagaDto = {
        title: 'Harry Potter',
        description: 'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling.',
        nbVolumes: 7
      }

      const response = await request(app.getHttpServer())
        .post('/saga')
        .send(createSagaDto)
        .expect(201)

      expect(response.body.data.title).toBe(createSagaDto.title)
      expect(response.body.data.description).toBe(createSagaDto.description)
      expect(response.body.data.nbVolumes).toBe(createSagaDto.nbVolumes)
      expect(response.body.success).toBe(true)
    })

    it('should return 400 if data is invalid', async () => {
      const createSagaDto = {
        title: '',
        description: '',
        nbVolumes: -1
      }

      const response = await request(app.getHttpServer())
        .post('/saga')
        .send(createSagaDto)
        .expect(400)

      const errorMessages = response.body.message
      expect(errorMessages).toContain('title should not be empty')
      expect(errorMessages).toContain('description should not be empty')
      expect(errorMessages).toContain('nbVolumes must be a positive number')
    })
  })

  describe('/saga (GET)', () => {
    it('should return all sagas', async () => {
      const saga1 = await sagaRepository.save({
        title: 'Harry Potter',
        description: 'Fantasy series',
        nbVolumes: 7
      })
      const saga2 = await sagaRepository.save({
        title: 'The Lord of the Rings',
        description: 'Epic high-fantasy novel',
        nbVolumes: 3
      })

      const response = await request(app.getHttpServer()).get('/saga').expect(200)

      const sortedSagas = response.body.data.sort((a: any, b: any) => a.id - b.id)

      expect(sortedSagas.length).toBe(3)
      expect(sortedSagas[1].title).toBe(saga1.title)
      expect(sortedSagas[2].title).toBe(saga2.title)
    })
  })

  describe('/saga/:id (GET)', () => {
    it('should return a saga by id', async () => {
      const saga = await sagaRepository.save({
        title: 'Harry Potter',
        description: 'Fantasy series',
        nbVolumes: 7
      })

      const response = await request(app.getHttpServer())
        .get(`/saga/${saga.id}`)
        .expect(200)

      expect(response.body.data.title).toBe(saga.title)
      expect(response.body.data.description).toBe(saga.description)
      expect(response.body.data.nbVolumes).toBe(saga.nbVolumes)
    })

    it('should return 404 if the saga is not found', async () => {
      const response = await request(app.getHttpServer()).get('/saga/9999').expect(200)

      expect(response.body.message).toBe('Saga not found')
    })
  })

  describe('/saga/:id (PATCH)', () => {
    it('should update a saga', async () => {
      const saga = await sagaRepository.save({
        title: 'Harry Potter',
        description: 'Fantasy series',
        nbVolumes: 7
      })

      const updateSagaDto: UpdateSagaDto = {
        title: 'The Hobbit',
        description: 'Fantasy novel',
        nbVolumes: 3
      }

      const response = await request(app.getHttpServer())
        .patch(`/saga/${saga.id}`)
        .send(updateSagaDto)
        .expect(200)

      expect(response.body.data.title).toBe(updateSagaDto.title)
      expect(response.body.data.description).toBe(updateSagaDto.description)
      expect(response.body.data.nbVolumes).toBe(updateSagaDto.nbVolumes)
    })

    it('should return 404 if the saga is not found', async () => {
      const updateSagaDto: UpdateSagaDto = {
        title: 'The Hobbit',
        description: 'Fantasy novel',
        nbVolumes: 3
      }

      const response = await request(app.getHttpServer())
        .patch('/saga/9999')
        .send(updateSagaDto)
        .expect(200)

      expect(response.body.message).toBe('Saga not found')
    })
  })

  describe('/saga/:id (DELETE)', () => {
    it('should delete a saga', async () => {
      const saga = await sagaRepository.save({
        title: 'Harry Potter',
        description: 'Fantasy series',
        nbVolumes: 7
      })

      const response = await request(app.getHttpServer())
        .delete(`/saga/${saga.id}`)
        .expect(200)

      expect(response.body.data.title).toBe(saga.title)
      expect(response.body.message).toBe('Saga Removed Successfully')
    })

    it('should return 404 if the saga is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/saga/9999').expect(200)

      expect(response.body.message).toBe('Saga not found')
    })
  })
})

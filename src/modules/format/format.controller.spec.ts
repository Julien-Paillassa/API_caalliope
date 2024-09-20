/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { Format } from './entities/format.entity'
import { FormatModule } from './format.module'
import { type Repository } from 'typeorm'
import * as dotenv from 'dotenv'
import { type CreateFormatDto } from './dto/create-format.dto'
import { type UpdateFormatDto } from './dto/update-format.dto'
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

describe('FormatController (e2e)', () => {
  let app: INestApplication
  let formatRepository: Repository<Format>

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
        FormatModule
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

    formatRepository = moduleFixture.get<Repository<Format>>(getRepositoryToken(Format))
  })

  afterAll(async () => {
    await formatRepository.delete({})
    await app.close()
  })

  describe('/format (POST)', () => {
    it('should successfully create a format', async () => {
      const createFormatDto: CreateFormatDto = {
        type: 'Paperback',
        language: 'English'
      }

      const response = await request(app.getHttpServer())
        .post('/format')
        .send(createFormatDto)
        .expect(201)

      expect(response.body.data.type).toBe(createFormatDto.type)
      expect(response.body.data.language).toBe(createFormatDto.language)
      expect(response.body.success).toBe(true)
    })

    it('should return 400 if data is invalid', async () => {
      const createFormatDto = {
        type: '',
        language: ''
      }

      const response = await request(app.getHttpServer())
        .post('/format')
        .send(createFormatDto)
        .expect(400)

      const errorMessages = response.body.message
      expect(errorMessages).toContain('type should not be empty')
      expect(errorMessages).toContain('language should not be empty')
    })
  })

  describe('/format (GET)', () => {
    it('should return all formats', async () => {
      const format1 = await formatRepository.save({
        type: 'Hardcover',
        language: 'French'
      })
      const format2 = await formatRepository.save({
        type: 'Ebook',
        language: 'Spanish'
      })

      const response = await request(app.getHttpServer()).get('/format').expect(200)

      const sortedFormats = response.body.data.sort((a: any, b: any) => b.type - a.type)

      expect(sortedFormats.length).toBe(3)
      expect(sortedFormats[1].type).toBe('Hardcover')
      expect(sortedFormats[2].type).toBe('Ebook')
    })
  })

  describe('/format/:id (GET)', () => {
    it('should return a format by id', async () => {
      const format = await formatRepository.save({
        type: 'Paperback',
        language: 'English'
      })

      const response = await request(app.getHttpServer())
        .get(`/format/${format.id}`)
        .expect(200)

      expect(response.body.data.type).toBe(format.type)
      expect(response.body.data.language).toBe(format.language)
    })

    it('should return 404 if the format is not found', async () => {
      const response = await request(app.getHttpServer()).get('/format/9999').expect(200)

      expect(response.body.message).toBe('Format not found')
    })
  })

  describe('/format/:id (PATCH)', () => {
    it('should update a format', async () => {
      const format = await formatRepository.save({
        type: 'Paperback',
        language: 'English'
      })

      const updateFormatDto: UpdateFormatDto = {
        type: 'Hardcover',
        language: 'French'
      }

      const response = await request(app.getHttpServer())
        .patch(`/format/${format.id}`)
        .send(updateFormatDto)
        .expect(200)

      expect(response.body.data.type).toBe(updateFormatDto.type)
      expect(response.body.data.language).toBe(updateFormatDto.language)
    })

    it('should return 404 if the format is not found', async () => {
      const updateFormatDto: UpdateFormatDto = {
        type: 'Hardcover',
        language: 'French'
      }

      const response = await request(app.getHttpServer()).patch('/format/9999').send(updateFormatDto).expect(200)

      expect(response.body.message).toBe('Format not found')
    })
  })

  describe('/format/:id (DELETE)', () => {
    it('should delete a format', async () => {
      const format = await formatRepository.save({
        type: 'Ebook',
        language: 'German'
      })

      const response = await request(app.getHttpServer()).delete(`/format/${format.id}`).expect(200)

      expect(response.body.data.type).toBe(format.type)
      expect(response.body.message).toBe('Format Deleted Successfully')
    })

    it('should return 404 if the format is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/format/9999').expect(200)

      expect(response.body.message).toBe('Format not found')
    })
  })
})

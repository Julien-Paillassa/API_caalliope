/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { PublishingModule } from './publishing.module'
import { type Repository } from 'typeorm'
import * as dotenv from 'dotenv'
import { Publishing } from './entities/publishing.entity'
import { Author } from '../author/entities/author.entity'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Book } from '../book/entities/book.entity'
import { Cover } from '../cover/entities/cover.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Saga } from '../saga/entities/saga.entity'
import { UserBook } from '../user-book/entities/user-book.entity'
import { User } from '../user/entities/user.entity'
import { Comment } from '../comment/entities/comment.entity'
import { type CreatePublishingDto } from './dto/create-publishing.dto'
import { type UpdatePublishingDto } from './dto/update-publishing.dto'
import { Status } from '../admin/entities/status.enum'
import { Format } from '../format/entities/format.entity'

describe('PublishingController (e2e)', () => {
  let app: INestApplication
  let publishingRepository: Repository<Publishing>

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
        PublishingModule
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

    publishingRepository = moduleFixture.get<Repository<Publishing>>(getRepositoryToken(Publishing))
  })

  afterAll(async () => {
    await publishingRepository.delete({})
    await app.close()
  })

  describe('/publishing (POST)', () => {
    it('should successfully create a publishing', async () => {
      const createPublishingDto: CreatePublishingDto = {
        label: 'Gallimard',
        language: 'French',
        isbn: '9782070423201',
        nbPages: 350,
        publicationDate: '2023-05-01'
      }

      const response = await request(app.getHttpServer())
        .post('/publishing')
        .send(createPublishingDto)
        .expect(201)

      expect(response.body.data.label).toBe(createPublishingDto.label)
      expect(response.body.data.language).toBe(createPublishingDto.language)
      expect(response.body.data.isbn).toBe(createPublishingDto.isbn)
      expect(response.body.success).toBe(true)
    })

    it('should return 400 if data is invalid', async () => {
      const createPublishingDto = {
        label: '',
        language: '',
        isbn: '',
        nbPages: '',
        publicationDate: ''
      }

      const response = await request(app.getHttpServer())
        .post('/publishing')
        .send(createPublishingDto)
        .expect(400)

      const errorMessages = response.body.message
      expect(errorMessages).toContain('label should not be empty')
      expect(errorMessages).toContain('language should not be empty')
      expect(errorMessages).toContain('isbn should not be empty')
      expect(errorMessages).toContain('nbPages must be a number conforming to the specified constraints')
      expect(errorMessages).toContain('nbPages should not be empty')
      expect(errorMessages).toContain('publicationDate should not be empty')
    })
  })

  describe('/publishing (GET)', () => {
    it('should return all publishing records', async () => {
      const publishing1 = await publishingRepository.save({
        label: 'Hachette',
        language: 'French',
        isbn: '9782070423201',
        nbPages: 200,
        publicationDate: '2021-01-01'
      })

      const publishing2 = await publishingRepository.save({
        label: 'Penguin',
        language: 'English',
        isbn: '9780141036144',
        nbPages: 300,
        publicationDate: '2022-06-01'
      })

      const response = await request(app.getHttpServer()).get('/publishing').expect(200)

      const sortedPublishing = response.body.data.sort((a: any, b: any) => a.id - b.id)

      expect(sortedPublishing.length).toBe(3)
      expect(sortedPublishing[1].label).toBe(publishing1.label)
      expect(sortedPublishing[2].label).toBe(publishing2.label)
    })
  })

  describe('/publishing/:id (GET)', () => {
    it('should return a publishing by id', async () => {
      const publishing = await publishingRepository.save({
        label: 'Gallimard',
        language: 'French',
        isbn: '9782070423201',
        nbPages: 250,
        publicationDate: '2023-05-01'
      })

      const response = await request(app.getHttpServer())
        .get(`/publishing/${publishing.id}`)
        .expect(200)

      expect(response.body.data.label).toBe(publishing.label)
      expect(response.body.data.language).toBe(publishing.language)
    })

    it('should return 404 if the publishing is not found', async () => {
      const response = await request(app.getHttpServer()).get('/publishing/9999').expect(200)

      expect(response.body.message).toBe('Publishing not found')
    })
  })

  describe('/publishing/:id (PATCH)', () => {
    it('should update a publishing', async () => {
      const publishing = await publishingRepository.save({
        label: 'Hachette',
        language: 'French',
        isbn: '9782070423201',
        nbPages: 200,
        publicationDate: '2021-01-01'
      })

      const updatePublishingDto: UpdatePublishingDto = {
        label: 'Gallimard',
        language: 'English',
        status: Status.ACCEPTED
      }

      const response = await request(app.getHttpServer())
        .patch(`/publishing/${publishing.id}`)
        .send(updatePublishingDto)
        .expect(200)

      expect(response.body.data.label).toBe(updatePublishingDto.label)
      expect(response.body.data.language).toBe(updatePublishingDto.language)
    })

    it('should return 404 if the publishing is not found', async () => {
      const updatePublishingDto: UpdatePublishingDto = {
        label: 'Gallimard',
        language: 'English',
        status: Status.ACCEPTED
      }

      const response = await request(app.getHttpServer()).patch('/publishing/9999').send(updatePublishingDto).expect(200)

      expect(response.body.message).toBe('Publishing not found')
    })
  })

  describe('/publishing/:id (DELETE)', () => {
    it('should delete a publishing', async () => {
      const publishing = await publishingRepository.save({
        label: 'To Be Deleted',
        language: 'Spanish',
        isbn: '9788420437235',
        nbPages: 400,
        publicationDate: '2020-02-15'
      })

      const response = await request(app.getHttpServer()).delete(`/publishing/${publishing.id}`).expect(200)

      expect(response.body.data.label).toBe(publishing.label)
      expect(response.body.message).toBe('Publishing Removed Successfully')
    })

    it('should return 404 if the publishing is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/publishing/9999').expect(200)

      expect(response.body.message).toBe('Publishing not found')
    })
  })
})

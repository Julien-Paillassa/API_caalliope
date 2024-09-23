/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity'
import { AuthModule } from './auth.module'
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
import { JwtService } from '@nestjs/jwt'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let jwtService: JwtService
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
        AuthModule
      ]
    }).compile()

    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }))

    await app.init()

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User))
    jwtService = moduleFixture.get<JwtService>(JwtService)
  })

  afterEach(async () => {
    await userRepository.delete({})
  })

  afterAll(async () => {
    await userRepository.delete({})
    await app.close()
  })

  describe('/auth/register (POST)', () => {
    it('should successfully register a user and set JWT cookie', async () => {
      const signUpDto = {
        email: 'test2@example.com',
        password: 'password', // plain text
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe'
      }

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(signUpDto)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User registered successfully')

      // Check if the JWT cookie is set
      expect(response.headers['set-cookie']).toBeDefined()

      const user = await userRepository.findOne({ where: { email: signUpDto.email } })
      expect(user).toBeDefined()
      expect(user).not.toBeNull()
      if (user != null) {
        expect(await bcrypt.compare(signUpDto.password, user.password)).toBe(true)
      }
    })
  })

  describe('/auth/login (POST)', () => {
    it('should successfully login a user and set JWT cookie', async () => {
      const user = userRepository.create({
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Nest',
        lastName: 'Mongoose',
        username: 'nestmongoose'
      })
      await userRepository.save(user)

      const signInDto = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(signInDto)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User Login successfully')

      // Check if the JWT cookie is set
      expect(response.headers['set-cookie']).toBeDefined()
    })

    /* it('should return a 401 error for invalid password', async () => {
      const user = userRepository.create({
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Nest',
        lastName: 'Mongoose',
        username: 'nestmongoose'
      })
      await userRepository.save(user)

      const signInDto = {
        email: 'test@example.com',
        password: 'wrongPassword'
      }

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(signInDto)
        .expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Incorrect password')
    }) */

    /* it('should return a 404 error for invalid email', async () => {
      const signInDto = {
        email: 'wrong@example.com',
        password: 'password123'
      }

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(signInDto)
        .expect(404) // Updated to 404 Not Found

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Email does not exist')
    }) */
  })

  describe('/auth/refresh (POST)', () => {
    it('should return a new access token', async () => {
      const newUser = userRepository.create({
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Pikachu',
        lastName: 'Jigglypuff',
        username: 'pikajiggly'
      })
      await userRepository.save(newUser)

      const user = await userRepository.findOneOrFail({ where: { email: 'test@example.com' } })

      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }

      const refreshToken = await jwtService.signAsync(payload)

      const refreshTokenDto = {
        refreshToken
      }

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(refreshTokenDto)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Token Refreshed Successfully')
      expect(response.body.data.access_token).toBeDefined()
    })

    it('should return an error for invalid refresh token', async () => {
      const refreshTokenDto = {
        refreshToken: 'invalid-token'
      }

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send(refreshTokenDto)
        .expect(200)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid refresh token')
    })
  })
})

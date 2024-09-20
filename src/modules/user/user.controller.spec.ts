/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
import { UserModule } from './user.module'
import { type Repository } from 'typeorm'
import { type CreateUserDto } from './dto/create-user.dto'
import { type UpdateUserDto } from './dto/update-user.dto'
import { UserRole } from './entities/user-role.enum'
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

describe('UserController (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>

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
        UserModule
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

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(async () => {
    await userRepository.delete({})
  })

  afterAll(async () => {
    await userRepository.delete({})
    await app.close()
  })

  describe('/user (POST)', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        lastName: 'Doewn',
        firstName: 'Johnny',
        email: 'Johnny.Doewn@example.com',
        password: 'password',
        username: 'JohnnyDoewn',
        role: UserRole.USER
      }

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User Created Successfully')
      expect(response.body.data.lastName).toBe(createUserDto.lastName)
      expect(response.body.data.firstName).toBe(createUserDto.firstName)
      expect(response.body.data.email).toBe(createUserDto.email)
    })

    it('should return 400 if data is invalid', async () => {
      const createUserDto = {
        lastName: '',
        firstName: '',
        email: 'invalidemail',
        password: '',
        username: '',
        role: 'INVALID_ROLE'
      }

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(400)

      const errorMessages = response.body.message
      expect(errorMessages).toContain('lastName should not be empty')
      expect(errorMessages).toContain('firstName should not be empty')
      expect(errorMessages).toContain('email must be an email')
      expect(errorMessages).toContain('password should not be empty')
      expect(errorMessages).toContain('username should not be empty')
      expect(errorMessages).toContain('role must be one of the following values: admin, moderator, contributor, user')
    })
  })

  describe('/user (GET)', () => {
    it('should return all users', async () => {
      const user1 = await userRepository.save({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password',
        username: 'johndoe',
        role: UserRole.USER
      })
      const user2 = await userRepository.save({
        lastName: 'Smith',
        firstName: 'Jane',
        email: 'jane.smith@example.com',
        password: 'password',
        username: 'janesmith',
        role: UserRole.USER
      })

      const response = await request(app.getHttpServer()).get('/user').expect(200)

      const sortedUsers = response.body.data.sort((a: any, b: any) => a.id - b.id)

      expect(sortedUsers.length).toBeGreaterThanOrEqual(2)
      expect(sortedUsers[0].email).toBe(user1.email)
      expect(sortedUsers[1].email).toBe(user2.email)
    })
  })

  describe('/user/:id (GET)', () => {
    it('should return a user by id', async () => {
      const user = await userRepository.save({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password',
        username: 'johndoe',
        role: UserRole.USER
      })

      const response = await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(200)

      expect(response.body.data.lastName).toBe(user.lastName)
      expect(response.body.data.firstName).toBe(user.firstName)
      expect(response.body.data.email).toBe(user.email)
    })

    it('should return 404 if the user is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/9999')
        .expect(200)

      expect(response.body.message).toBe('User not found')
    })
  })

  describe('/user/:id (PATCH)', () => {
    it('should update a user', async () => {
      const user = await userRepository.save({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password',
        username: 'johndoe',
        role: UserRole.USER
      })

      const updateUserDto: UpdateUserDto = {
        lastName: 'Smith',
        firstName: 'John',
        email: 'john.smith@example.com',
        password: 'newpassword',
        username: 'johnsmith',
        role: UserRole.USER
      }

      const response = await request(app.getHttpServer())
        .patch(`/user/${user.id}`)
        .send(updateUserDto)
        .expect(200)

      expect(response.body.data.lastName).toBe(updateUserDto.lastName)
      expect(response.body.data.email).toBe(updateUserDto.email)
    })

    it('should return 404 if the user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        lastName: 'Smith',
        firstName: 'John',
        email: 'john.smith@example.com',
        password: 'newpassword',
        username: 'johnsmith',
        role: UserRole.USER
      }

      const response = await request(app.getHttpServer())
        .patch('/user/9999')
        .send(updateUserDto)
        .expect(200)

      expect(response.body.message).toBe('User not found')
    })
  })

  describe('/user/:id (DELETE)', () => {
    it('should delete a user', async () => {
      const user = await userRepository.save({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password',
        username: 'johndoe',
        role: UserRole.USER
      })

      const response = await request(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .expect(200)

      expect(response.body.message).toBe('User Deleted Successfully')
    })

    it('should return 404 if the user is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user/9999')
        .expect(200)

      expect(response.body.message).toBe('User not found')
    })
  })
})

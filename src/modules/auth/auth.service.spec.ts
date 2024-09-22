/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { type SignInDto } from './dto/sign-in.dto'
import { type SignUpDto } from './dto/sign-up.dto'
import { type RefreshTokenDto } from './dto/refresh-token.dto'
import { UserRole } from '../user/entities/user-role.enum'
import { Avatar } from '../avatar/entities/avatar.entity'

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
            findOne: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            decode: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  describe('signUp', () => {
    it('should successfully create a new user', async () => {
      const signUpDto: SignUpDto = {
        email: 'john.doe@example.com',
        password: 'strongPassword123',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe'
      }

      const user = new User()
      user.email = signUpDto.email

      jest.spyOn(userRepository, 'create').mockReturnValue(user)
      jest.spyOn(userRepository, 'save').mockResolvedValue(user)

      const result = await authService.signUp(signUpDto)
      expect(result).toBe(user)
    })
  })

  describe('signIn', () => {
    it('should return a token for valid credentials', async () => {
      const signInDto: SignInDto = { email: 'john.doe@example.com', password: 'strongPassword123' }
      const user: User = {
        id: 101,
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        username: 'johndoe',
        avatar: new Avatar(),
        userBook: [],
        comment: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(userService, 'findOneByEmail').mockImplementation(async () => user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwt-token')

      const result = await authService.signIn(signInDto)

      expect(userService.findOneByEmail).toHaveBeenCalledWith(signInDto.email)
      expect(bcrypt.compare).toHaveBeenCalledWith(signInDto.password, user.password)
      expect(jwtService.signAsync).toHaveBeenCalled()
      expect(result).toEqual({ access_token: 'jwt-token' })
    })

    it('should throw UnauthorizedException if email does not exist', async () => {
      const signInDto: SignInDto = { email: 'john.doe@example.com', password: 'password' }

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null)

      await expect(authService.signIn(signInDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const signInDto: SignInDto = { email: 'john.doe@example.com', password: 'wrongPassword' }
      const user: User = {
        id: 101,
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password', 10),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        username: 'johndoe',
        avatar: new Avatar(),
        userBook: [],
        comment: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

      await expect(authService.signIn(signInDto)).rejects.toThrow(UnauthorizedException)
    })

    /* it('should throw InternalServerErrorException on unexpected errors', async () => {
      const signInDto: SignInDto = { email: 'john.doe@example.com', password: 'password' }

      jest.spyOn(userService, 'findOneByEmail').mockRejectedValue(new Error('Unexpected error'))

      await expect(authService.signIn(signInDto)).rejects.toThrow(InternalServerErrorException)
    }) */
  })

  describe('refreshAccessToken', () => {
    it('should return a new access token if refresh token is valid', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'valid-refresh-token' }
      const user = {
        id: 1,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      }
      const decodedToken = { sub: user.id, email: user.email }

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken)
      jest.spyOn(userService, 'findOne').mockResolvedValue(user)
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('new-jwt-token')

      const result = await authService.refreshAccessToken(refreshTokenDto)

      expect(jwtService.decode).toHaveBeenCalledWith(refreshTokenDto.refreshToken)
      expect(userService.findOne).toHaveBeenCalledWith(user.id)
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      })
      expect(result).toEqual({ access_token: 'new-jwt-token' })
    })

    it('should throw UnauthorizedException if user is not found', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'valid-refresh-token' }
      const decodedToken = { sub: 1, email: 'john.doe@example.com' }

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken)
      jest.spyOn(userService, 'findOne').mockResolvedValue(null)

      await expect(authService.refreshAccessToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'invalid-refresh-token' }

      jest.spyOn(jwtService, 'decode').mockReturnValue(null)

      await expect(authService.refreshAccessToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException)
    })
  })
})

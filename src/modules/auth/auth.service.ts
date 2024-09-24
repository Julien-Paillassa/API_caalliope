import { Injectable, UnauthorizedException, Logger, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { type SignInDto } from './dto/sign-in.dto'
import { User } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { type SignUpDto } from './dto/sign-up.dto'
import { type RefreshTokenDto } from './dto/refresh-token.dto'
import { type JwtPayload } from './interface/jwt-payload.interface'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async signIn (signInDto: SignInDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findOneByEmail(signInDto.email)
      if (user == null) {
        this.logger.warn(`User not found: ${signInDto.email}`)
        throw new UnauthorizedException('Email does not exist')
      }

      const isPasswordValid = await bcrypt.compare(signInDto.password, user.password)
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${signInDto.email}`)
        throw new UnauthorizedException('Incorrect password')
      }

      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }

      return { access_token: await this.jwtService.signAsync(payload) }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      this.logger.error(`Error during sign in for user: ${signInDto.email}`, error.stack)
      throw new InternalServerErrorException('Failed to sign in')
    }
  }

  async signUp (signUpDto: SignUpDto): Promise<{ access_token: string, user: User }> {
    try {
      let user = this.userRepository.create(signUpDto)
      user = await this.userRepository.save(user)

      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }

      return { access_token: await this.jwtService.signAsync(payload), user }
    } catch (error) {
      this.logger.error('Error registering user', error.stack)
      throw new HttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async refreshAccessToken (refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.decode(refreshTokenDto.refreshToken)
      const user = await this.userService.findOne(payload.sub as number)

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      if (payload.email !== user.email) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }

      const accessToken = await this.jwtService.signAsync(newPayload)

      return { access_token: accessToken }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}

import { Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn (lastName: string, pass: string): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findOneByLastName(lastName)

      if ((user == null) || !(await bcrypt.compare(pass, user.password))) {
        this.logger.warn(`Invalid credentials for user: ${lastName}`)
        throw new UnauthorizedException('Invalid credentials')
      }

      const payload = {
        sub: user.id,
        lastName: user.lastName
      }

      return { access_token: await this.jwtService.signAsync(payload) }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      this.logger.error(`Error during sign in for user: ${lastName}`, error.stack)
      throw new InternalServerErrorException('Failed to sign in')
    }
  }
}

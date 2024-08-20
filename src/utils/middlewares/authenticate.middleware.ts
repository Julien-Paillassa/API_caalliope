import { Injectable, type NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { type Request, type Response, type NextFunction } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor (private readonly jwtService: JwtService) {}

  async use (req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization

    if (authHeader == null) {
      throw new UnauthorizedException('Authorization header missing')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = await this.jwtService.verifyAsync(token)
      req.user = decoded
      next()
    } catch (err) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}

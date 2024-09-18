import {Injectable, Logger, type NestMiddleware, UnauthorizedException} from '@nestjs/common'
import { type Request, type Response, type NextFunction } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor (private readonly jwtService: JwtService) {}
  private readonly logger = new Logger(AuthenticateMiddleware.name)

  async use (req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies.token

    if (token == null) {
      throw new UnauthorizedException('Authorization header missing')
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token)
      req.user = decoded
      next()
    } catch (err) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}

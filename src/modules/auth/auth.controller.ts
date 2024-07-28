import { Body, Controller, HttpCode, HttpStatus, Post, Get, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from 'src/utils/guards/auth.guard'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn (@Body() signInDto: { lastName: string, password: string }): Promise<any> {
    return await this.authService.signIn(signInDto.lastName, signInDto.password)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile (@Request() req): any {
    return req.user
  }
}

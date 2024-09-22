import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constantes'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' }
    })
  ]
})
export class AuthModule {}

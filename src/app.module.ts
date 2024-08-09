import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './modules/user/user.controller'
import { UserModule } from './modules/user/user.module'
import { UserService } from './modules/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm' // Add this import
import { User } from './modules/user/entities/user.entity'
import { AuthModule } from './modules/auth/auth.module'
import { Saga } from './modules/saga/entities/saga.entity'
import { Format } from './modules/format/entities/format.entity'
import { Comment } from './modules/comment/entities/comment.entity'
import { Book } from './modules/book/entities/book.entity'
import { Author } from './modules/author/entities/author.entity'
import { Publisher } from './modules/publisher/entities/publisher.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './modules/auth/constantes'
import { AuthenticateMiddleware } from './utils/middlewares/authenticate.middleware'

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'caaliope',
      password: 'caaliope_dev*2024!',
      database: 'database_caaliope_dev',
      entities: [User, Saga, Format, Comment, Book, Author, Publisher],
      synchronize: true,
      autoLoadEntities: true
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' }
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService]
})
export class AppModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}

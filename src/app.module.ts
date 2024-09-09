import { type MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './modules/user/user.controller'
import { UserModule } from './modules/user/user.module'
import { UserService } from './modules/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './modules/user/entities/user.entity'
import { AuthModule } from './modules/auth/auth.module'
import { Saga } from './modules/saga/entities/saga.entity'
import { Comment } from './modules/comment/entities/comment.entity'
import { Book } from './modules/book/entities/book.entity'
import { Author } from './modules/author/entities/author.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './modules/auth/constantes'
import { AuthenticateMiddleware } from './utils/middlewares/authenticate.middleware'
import { Avatar } from './modules/avatar/entities/avatar.entity'
import { Cover } from './modules/cover/entities/cover.entity'
import { Genre } from './modules/genre/entities/genre.entity'
import { AuthorModule } from './modules/author/author.module'
import { AuthorController } from './modules/author/author.controller'
import { AuthorService } from './modules/author/author.service'
import { BookModule } from './modules/book/book.module'
import { BookController } from './modules/book/book.controller'
import { BookService } from './modules/book/book.service'
import { FormatModule } from './modules/format/format.module'
import { FormatController } from './modules/format/format.controller'
import { FormatService } from './modules/format/format.service'
import { GenreModule } from './modules/genre/genre.module'
import { GenreService } from './modules/genre/genre.service'
import { GenreController } from './modules/genre/genre.controller'
import { SagaModule } from './modules/saga/saga.module'
import { SagaController } from './modules/saga/saga.controller'
import { SagaService } from './modules/saga/saga.service'
import { Format } from './modules/format/entities/format.entity'
import { Publishing } from './modules/publishing/entities/publishing.entity'
import { PublishingController } from './modules/publishing/publishing.controller'
import { PublishingService } from './modules/publishing/publishing.service'
import { PublishingModule } from './modules/publishing/publishing.module'
import { UserBook } from './modules/user-book/entities/user-book.entity'
import { UserBookService } from './modules/user-book/user-book.service'
import { UserBookController } from './modules/user-book/user-book.controller'
import { UserBookModule } from './modules/user-book/user-book.module'
import { CommentModule } from './modules/comment/comment.module'
import { CommentController } from './modules/comment/comment.controller'
import { CommentService } from './modules/comment/comment.service'
import { AvatarModule } from './modules/avatar/avatar.module'
import { AvatarController } from './modules/avatar/avatar.controller'
import { AvatarService } from './modules/avatar/avatar.service'
import { MulterModule } from '@nestjs/platform-express'
import { CoverModule } from './modules/cover/cover.module'
import { CoverController } from './modules/cover/cover.controller'
import { CoverService } from './modules/cover/cover.service'
import { StripeModule } from './modules/stripe/stripe.module'
import { StripeController } from './modules/stripe/stripe.controller'
import { StripeService } from './modules/stripe/stripe.service'
import * as dotenv from 'dotenv'

dotenv.config()
let dbConfig: { host?: any, username?: any, password?: any, database?: any } = {}

const getDatabaseConfig = (): { host?: any, username?: any, password?: any, database?: any } => {
  const env = process.env.NODE_ENV

  if (env === 'dev') {
    return {
      host: process.env.DATABASE_HOST_DEV,
      username: process.env.DATABASE_USERNAME_DEV,
      password: process.env.DATABASE_PASSWORD_DEV,
      database: process.env.DATABASE_NAME_DEV
    }
  } else if (env === 'test') {
    return {
      host: process.env.DATABASE_HOST_TEST,
      username: process.env.DATABASE_USERNAME_TEST,
      password: process.env.DATABASE_PASSWORD_TEST,
      database: process.env.DATABASE_NAME_TEST
    }
  } else if (env === 'prod') {
    return {
      host: process.env.DATABASE_HOST_PROD,
      username: process.env.DATABASE_USERNAME_PROD,
      password: process.env.DATABASE_PASSWORD_PROD,
      database: process.env.DATABASE_NAME_PROD
    }
  }

  return {}
}

dbConfig = getDatabaseConfig()
console.log(dbConfig)

@Module({
  imports: [
    UserModule,
    AuthModule,
    AuthorModule,
    BookModule,
    FormatModule,
    GenreModule,
    PublishingModule,
    SagaModule,
    UserBookModule,
    CommentModule,
    AvatarModule,
    CoverModule,
    StripeModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: 5432,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
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
      synchronize: true,
      autoLoadEntities: true
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' }
    }),
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [
    AppController,
    UserController,
    AuthorController,
    BookController,
    FormatController,
    GenreController,
    PublishingController,
    SagaController,
    UserBookController,
    CommentController,
    AvatarController,
    CoverController,
    StripeController
  ],
  providers: [
    AppService,
    UserService,
    AuthorService,
    BookService,
    FormatService,
    GenreService,
    PublishingService,
    SagaService,
    UserBookService,
    CommentService,
    AvatarService,
    CoverService,
    StripeService
  ]
})
export class AppModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
        { path: 'saga', method: RequestMethod.GET },
        { path: 'saga/:id', method: RequestMethod.GET },
        { path: 'book', method: RequestMethod.GET },
        { path: 'book/:id', method: RequestMethod.GET },
        { path: 'author', method: RequestMethod.GET },
        { path: 'author/:id', method: RequestMethod.GET },
        { path: 'genre', method: RequestMethod.GET },
        { path: 'genre/:id', method: RequestMethod.GET },
        { path: 'publishing', method: RequestMethod.GET },
        { path: 'publishing/:id', method: RequestMethod.GET },
        { path: 'stripe/payment-intent', method: RequestMethod.POST },
        { path: 'stripe/create-checkout-session', method: RequestMethod.POST }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}

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
import { GoogleBookModule } from './modules/google-book/google-book.module'
import { GoogleBookService } from './modules/google-book/google-book.service'
import { GoogleBookController } from './modules/google-book/google-book.controller'
import * as dotenv from 'dotenv'
import { OrchestratorModule } from './modules/orchestrator/orchestrator.module'
import { OrchestratorService } from './modules/orchestrator/ochestrator.service'
import { CoreModule } from './core.module'

if (process.env.NODE_ENV === 'dev') {
  // dotenv.config({ path: './.env.dev' })
  dotenv.config({ path: './.env.test' })
} else if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: './.env.test' })
}

console.log('DATABASE_HOST', process.env.DATABASE_HOST)

@Module({
  imports: [
    CoreModule,
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
    GoogleBookModule,
    OrchestratorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      /* ssl: {
        rejectUnauthorized: false // Pour éviter des problèmes de vérification SSL
      }, */
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
      signOptions: { expiresIn: '200d' }
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
    StripeController,
    GoogleBookController
  ],
  providers: [
    OrchestratorService,
    AppService,
    UserService,
    AuthorService,
    BookService,
    OrchestratorService,
    FormatService,
    GenreService,
    PublishingService,
    SagaService,
    UserBookService,
    CommentService,
    AvatarService,
    CoverService,
    StripeService,
    GoogleBookService
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
        { path: 'book/genre/:genre', method: RequestMethod.GET },
        { path: 'author', method: RequestMethod.GET },
        { path: 'author/:id', method: RequestMethod.GET },
        { path: 'genre', method: RequestMethod.GET },
        { path: 'genre/:id', method: RequestMethod.GET },
        { path: 'publishing', method: RequestMethod.GET },
        { path: 'publishing/:id', method: RequestMethod.GET },
        { path: 'stripe/payment-intent', method: RequestMethod.POST },
        { path: 'stripe/create-checkout-session', method: RequestMethod.POST },
        { path: 'google-book/import', method: RequestMethod.GET }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}

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
import { Format } from './modules/format/entities/format.entity'
import { Comment } from './modules/comment/entities/comment.entity'
import { Book } from './modules/book/entities/book.entity'
import { Author } from './modules/author/entities/author.entity'
import { Publisher } from './modules/publisher/entities/publisher.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './modules/auth/constantes'
import { AuthenticateMiddleware } from './utils/middlewares/authenticate.middleware'
import { Avatar } from './modules/avatar/entities/avatar.entity'
import { UserType } from './modules/user-type/entities/user-type.entity'
import { Subscription } from './modules/subscription/entities/subscription.entity'
import { BookPropose } from './modules/book-propose/entities/book-propose.entity'
import { Possess } from './modules/possess/entities/possess.entity'
import { Publish } from './modules/publish/entities/publish.entity'
import { Status } from './modules/status/entities/status.entity'
import { ToMakeGo } from './modules/to-make-go/entities/to-make-go.entity'
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
import { PublisherModule } from './modules/publisher/publisher.module'
import { PublisherController } from './modules/publisher/publisher.controller'
import { PublisherService } from './modules/publisher/publisher.service'

@Module({
  imports: [
    UserModule,
    AuthModule,
    AuthorModule,
    BookModule,
    FormatModule,
    GenreModule,
    PublisherModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'caaliope',
      password: 'caaliope_dev*2024!',
      database: 'database_caaliope_dev',
      entities: [
        User,
        Saga,
        Format,
        Comment,
        Book,
        Author,
        Publisher,
        UserType,
        Avatar,
        Subscription,
        BookPropose,
        Possess,
        Publish,
        Status,
        ToMakeGo,
        Cover,
        Genre
      ],
      synchronize: true,
      autoLoadEntities: true
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' }
    })
  ],
  controllers: [
    AppController,
    UserController,
    AuthorController,
    BookController,
    FormatController,
    GenreController,
    PublisherController
  ],
  providers: [
    AppService,
    UserService,
    AuthorService,
    BookService,
    FormatService,
    GenreService,
    PublisherService
  ]
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

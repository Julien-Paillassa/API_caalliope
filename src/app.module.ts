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
import { Subscription } from './modules/subscription/entities/subscription.entity'
import { Possess } from './modules/possess/entities/possess.entity'
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
        Avatar,
        Subscription,
        Possess,
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
      dest: './uploads/avatars'
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
    AvatarController
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
    AvatarService
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

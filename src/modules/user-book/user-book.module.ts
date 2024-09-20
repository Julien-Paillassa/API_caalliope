import { Module } from '@nestjs/common'
import { UserBookService } from './user-book.service'
import { UserBookController } from './user-book.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserBook } from './entities/user-book.entity'
import { Book } from '../book/entities/book.entity'
import { User } from '../user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, UserBook])],
  controllers: [UserBookController],
  providers: [UserBookService],
  exports: [TypeOrmModule, UserBookService]
})
export class UserBookModule {}

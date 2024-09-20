import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Book } from '../book/entities/book.entity'
import { BookService } from '../book/book.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Book])],
  controllers: [UserController],
  providers: [UserService, BookService],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}

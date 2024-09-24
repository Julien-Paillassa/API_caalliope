import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Book } from '../book/entities/book.entity'
import { BookService } from '../book/book.service'
import {CommentModule} from "../comment/comment.module";
import {CommentService} from "../comment/comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Book]), CommentModule],
  controllers: [UserController],
  providers: [UserService, BookService, CommentService],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}

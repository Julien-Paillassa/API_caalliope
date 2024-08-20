import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { Book } from '../book/entities/book.entity'
import { User } from '../user/entities/user.entity'
import { Comment } from './entities/comment.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Book, User])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [TypeOrmModule, CommentService]
})
export class CommentModule {}

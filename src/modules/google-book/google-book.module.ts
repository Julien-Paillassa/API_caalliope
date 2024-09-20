import { Module } from '@nestjs/common'
import { GoogleBookController } from './google-book.controller'
import { GoogleBookService } from './google-book.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from '../author/entities/author.entity'
import { Book } from '../book/entities/book.entity'
import { Format } from '../format/entities/format.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Cover } from '../cover/entities/cover.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Genre, Format, Publishing, Cover])
  ],
  controllers: [GoogleBookController],
  providers: [GoogleBookService],
  exports: [GoogleBookService]
})
export class GoogleBookModule { }

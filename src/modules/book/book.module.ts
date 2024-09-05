import { Module } from '@nestjs/common'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { Book } from './entities/book.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import {OrchestratorService} from "./ochestrator.service";
import {AuthorModule} from "../author/author.module";
import {PublishingModule} from "../publishing/publishing.module";
import {CoverModule} from "../cover/cover.module";
import {FormatModule} from "../format/format.module";

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule, FormatModule, CoverModule, PublishingModule],
  controllers: [BookController],
  providers: [BookService, OrchestratorService],
  exports: [TypeOrmModule, BookService]
})
export class BookModule {}

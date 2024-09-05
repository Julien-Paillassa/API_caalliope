import {forwardRef, Module} from '@nestjs/common'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { Book } from './entities/book.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import {OrchestratorModule} from "../orchestrator/orchestrator.module";
import {CoreModule} from "../../core.module";

@Module({
  imports: [TypeOrmModule.forFeature([Book]), forwardRef(() => OrchestratorModule)],
  controllers: [BookController],
  providers: [BookService],
  exports: [TypeOrmModule, BookService]
})
export class BookModule {}

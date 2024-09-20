import {forwardRef, Module} from '@nestjs/common'
import { CoverService } from './cover.service'
import { CoverController } from './cover.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cover } from './entities/cover.entity'
import { Book } from '../book/entities/book.entity'
import { BookService } from '../book/book.service'
import {OrchestratorModule} from "../orchestrator/orchestrator.module";

@Module({
  imports: [TypeOrmModule.forFeature([Cover, Book]), forwardRef(() => OrchestratorModule),],
  controllers: [CoverController],
  providers: [CoverService, BookService],
  exports: [TypeOrmModule, CoverService]
})
export class CoverModule {}

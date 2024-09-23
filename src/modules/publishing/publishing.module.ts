import { forwardRef, Module } from '@nestjs/common'
import { PublishingService } from './publishing.service'
import { PublishingController } from './publishing.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Publishing } from './entities/publishing.entity'
import { OrchestratorService } from '../orchestrator/ochestrator.service'
import { OrchestratorModule } from '../orchestrator/orchestrator.module'
import { AuthorModule } from '../author/author.module'
import { BookModule } from '../book/book.module'
import { CoverModule } from '../cover/cover.module'
import { FormatModule } from '../format/format.module'

@Module({
  imports: [TypeOrmModule.forFeature([Publishing]),
    OrchestratorModule,
    AuthorModule,
    BookModule,
    CoverModule,
    FormatModule
  ],
  controllers: [PublishingController],
  providers: [PublishingService],
  exports: [TypeOrmModule, PublishingService]
})
export class PublishingModule {}

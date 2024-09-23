import { forwardRef, Module } from '@nestjs/common'
import { OrchestratorService } from './ochestrator.service'
import { AuthorModule } from '../author/author.module'
import { CoverModule } from '../cover/cover.module'
import { BookModule } from '../book/book.module'
import { FormatModule } from '../format/format.module'
import { PublishingModule } from '../publishing/publishing.module'

@Module({
  providers: [OrchestratorService],
  exports: [OrchestratorService],
  imports: [
    forwardRef(() => AuthorModule),
    forwardRef(() => CoverModule),
    forwardRef(() => BookModule),
    forwardRef(() => FormatModule),
    forwardRef(() => PublishingModule)

  ]
})
export class OrchestratorModule {}

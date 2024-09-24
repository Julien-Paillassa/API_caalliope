import { forwardRef, Module } from '@nestjs/common'
import { OrchestratorService } from './ochestrator.service'
import { AuthorModule } from '../author/author.module'
import { CoverModule } from '../cover/cover.module'
import { BookModule } from '../book/book.module'
import { FormatModule } from '../format/format.module'
import { PublishingModule } from '../publishing/publishing.module'
import { GenreModule } from '../genre/genre.module'
import { AvatarModule } from '../avatar/avatar.module'

@Module({
  providers: [OrchestratorService],
  exports: [OrchestratorService],
  imports: [
    forwardRef(() => AuthorModule),
    forwardRef(() => CoverModule),
    forwardRef(() => BookModule),
    forwardRef(() => FormatModule),
    forwardRef(() => PublishingModule),
    forwardRef(() => GenreModule),
    forwardRef(() => AvatarModule)
  ]
})
export class OrchestratorModule {}

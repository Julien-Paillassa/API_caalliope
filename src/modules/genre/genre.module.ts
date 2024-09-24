import { forwardRef, Module } from '@nestjs/common'
import { GenreService } from './genre.service'
import { GenreController } from './genre.controller'
import { Genre } from './entities/genre.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrchestratorModule } from '../orchestrator/orchestrator.module'
import { OrchestratorService } from '../orchestrator/ochestrator.service'

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), forwardRef(() => OrchestratorModule)],
  controllers: [GenreController],
  providers: [GenreService, OrchestratorService],
  exports: [TypeOrmModule, GenreService]
})
export class GenreModule {}

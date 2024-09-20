import { forwardRef, Module } from '@nestjs/common'
import { AuthorService } from './author.service'
import { AuthorController } from './author.controller'
import { Author } from './entities/author.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrchestratorModule } from '../orchestrator/orchestrator.module'

@Module({
  imports: [TypeOrmModule.forFeature([Author]), forwardRef(() => OrchestratorModule)],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [TypeOrmModule, AuthorService]
})
export class AuthorModule {}

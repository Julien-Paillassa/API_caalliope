import { forwardRef, Module } from '@nestjs/common'
import { FormatService } from './format.service'
import { FormatController } from './format.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Format } from './entities/format.entity'
import { OrchestratorModule } from '../orchestrator/orchestrator.module'

@Module({
  imports: [TypeOrmModule.forFeature([Format]), forwardRef(() => OrchestratorModule)],
  controllers: [FormatController],
  providers: [FormatService],
  exports: [TypeOrmModule, FormatService]
})
export class FormatModule {}

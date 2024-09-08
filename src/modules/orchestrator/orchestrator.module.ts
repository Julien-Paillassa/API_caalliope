import { Module } from '@nestjs/common'
import { OrchestratorService } from './ochestrator.service'

@Module({
  providers: [OrchestratorService],
  exports: [OrchestratorService]
})
export class OrchestratorModule {}

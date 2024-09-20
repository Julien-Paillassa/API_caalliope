import {forwardRef, Module} from '@nestjs/common'
import { PublishingService } from './publishing.service'
import { PublishingController } from './publishing.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Publishing } from './entities/publishing.entity'
import {OrchestratorService} from "../orchestrator/ochestrator.service";
import {OrchestratorModule} from "../orchestrator/orchestrator.module";

@Module({
  imports: [TypeOrmModule.forFeature([Publishing]), forwardRef(() => OrchestratorModule),],
  controllers: [PublishingController],
  providers: [PublishingService, OrchestratorService],
  exports: [TypeOrmModule, PublishingService]
})
export class PublishingModule {}

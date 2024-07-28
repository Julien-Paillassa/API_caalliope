import { Module } from '@nestjs/common';
import { SagaService } from './saga.service';
import { SagaController } from './saga.controller';

@Module({
  controllers: [SagaController],
  providers: [SagaService],
})
export class SagaModule {}

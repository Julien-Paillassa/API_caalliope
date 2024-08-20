import { Module } from '@nestjs/common'
import { SagaService } from './saga.service'
import { SagaController } from './saga.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Saga } from './entities/saga.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Saga])
  ],
  controllers: [SagaController],
  providers: [SagaService],
  exports: [TypeOrmModule, SagaService]
})
export class SagaModule {}

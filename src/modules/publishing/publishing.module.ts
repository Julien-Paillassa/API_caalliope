import { Module } from '@nestjs/common'
import { PublishingService } from './publishing.service'
import { PublishingController } from './publishing.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Publishing } from './entities/publishing.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Publishing])],
  controllers: [PublishingController],
  providers: [PublishingService],
  exports: [TypeOrmModule, PublishingService]
})
export class PublishingModule {}

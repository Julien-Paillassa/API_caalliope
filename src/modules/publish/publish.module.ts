import { Module } from '@nestjs/common';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';

@Module({
  controllers: [PublishController],
  providers: [PublishService],
})
export class PublishModule {}

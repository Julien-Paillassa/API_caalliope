import { Module } from '@nestjs/common';
import { FormatService } from './format.service';
import { FormatController } from './format.controller';

@Module({
  controllers: [FormatController],
  providers: [FormatService],
})
export class FormatModule {}

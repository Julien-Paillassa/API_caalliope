import { Module } from '@nestjs/common';
import { ToMakeGoService } from './to-make-go.service';
import { ToMakeGoController } from './to-make-go.controller';

@Module({
  controllers: [ToMakeGoController],
  providers: [ToMakeGoService],
})
export class ToMakeGoModule {}

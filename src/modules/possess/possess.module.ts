import { Module } from '@nestjs/common';
import { PossessService } from './possess.service';
import { PossessController } from './possess.controller';

@Module({
  controllers: [PossessController],
  providers: [PossessService],
})
export class PossessModule {}

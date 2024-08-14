import { Module } from '@nestjs/common';
import { BookProposeService } from './book-propose.service';
import { BookProposeController } from './book-propose.controller';

@Module({
  controllers: [BookProposeController],
  providers: [BookProposeService],
})
export class BookProposeModule {}

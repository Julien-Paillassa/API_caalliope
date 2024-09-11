import { Module } from '@nestjs/common'
import { GoogleBookController } from './google-book.controller'
import { GoogleBookService } from './google-book.service'

@Module({
  imports: [],
  controllers: [GoogleBookController],
  providers: [GoogleBookService],
  exports: [GoogleBookService]
})
export class GoogleBookModule { }

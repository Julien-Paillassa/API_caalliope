import { Controller, Get, Query } from '@nestjs/common'
import { GoogleBookService } from './google-book.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('google-book')
@Controller('google-book')
export class GoogleBookController {
  constructor (private readonly googleBookService: GoogleBookService) { }

  @Get('import')
  async importBooks (@Query('q') query: string): Promise<string> {
    const books = await this.googleBookService.fetchBooks(query)
    console.log('books')
    await this.googleBookService.saveBooksToDatabase(books)
    return `Successfully imported ${books.length} books.`
  }
}

import { Controller, Get, Query } from '@nestjs/common'
import { GoogleBookService } from './google-book.service'

@Controller('google-book')
export class GoogleBookController {
  constructor (private readonly googleBookService: GoogleBookService) { }

  @Get('import')
  async importBooks (@Query('q') query: string): Promise<string> {
    const books = await this.googleBookService.fetchBooks(query)
    // await this.googleBookService.saveBooksToDatabase(books)
    return `Successfully imported ${books.length} books.`
  }
}

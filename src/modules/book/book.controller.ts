import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Book } from './entities/book.entity'

@ApiBearerAuth()
@ApiTags('book')
@Controller('book')
export class BookController {
  private readonly logger = new Logger(BookService.name)
  constructor (private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create book' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Book
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createBookDto: CreateBookDto): Promise<any> {
    try {
      const book = await this.bookService.create(createBookDto)

      return {
        success: true,
        message: 'Book Created Successfully',
        data: book
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiOkResponse({
    description: 'Books Fetched Successfully',
    type: [Book]
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll (): Promise<any> {
    try {
      this.logger.error('FRFZFFF')
      const data = await this.bookService.findAll()
      return {
        success: true,
        data,
        message: 'Books Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiOkResponse({
    description: 'Book Fetched Successfully',
    type: Book
  })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.bookService.findOne(+id)
      return {
        success: true,
        data,
        message: 'Book Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update book' })
  @ApiOkResponse({
    description: 'Book Updated Successfully',
    type: Book
  })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update (@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<any> {
    try {
      const book = await this.bookService.update(+id, updateBookDto)
      return {
        success: true,
        message: 'Book Updated Successfully',
        data: book
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book' })
  @ApiOkResponse({
    description: 'Book Deleted Successfully',
    type: Book
  })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      const book = await this.bookService.remove(+id)
      return {
        success: true,
        message: 'Book Deleted Successfully',
        data: book
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiTags,
  ApiConsumes
} from '@nestjs/swagger'
import { Book } from './entities/book.entity'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { OrchestratorService } from '../orchestrator/ochestrator.service'

@ApiBearerAuth()
@ApiTags('book')
@Controller('book')
export class BookController {
  private readonly logger = new Logger(BookService.name)
  constructor (private readonly bookService: BookService,
    private readonly orchestratorService: OrchestratorService
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create book' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Book
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/covers',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        callback(null, `${uniqueSuffix}${ext}`)
      }
    })
  }))
  async create (@UploadedFile() cover: Express.Multer.File, @Body() createBookDto: CreateBookDto): Promise<any> {
    try {
      if (cover != null) {
        createBookDto.cover = cover
      }
      const book = await this.orchestratorService.createBookEntities(createBookDto)

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
      const data = await this.bookService.findAll()
      return {
        success: true,
        data,
        message: 'Books Fetched Successfully'
      }
    } catch (error) {
      this.logger.error(error)
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

  @Get('genre/:genre')
  @ApiOperation({ summary: 'Get book by genre' })
  @ApiOkResponse({
    description: 'Books Fetched Successfully',
    type: [Book]
  })
  @ApiNotFoundResponse({ description: 'Books not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getBooksByGenre (@Param('genre') genre: string): Promise<any> {
    try {
      this.logger.log(`Finding books by genre ${genre}`)
      const books = await this.bookService.getBooksByGenre(genre)
      return {
        success: true,
        data: books,
        message: 'Books Fetched Successfully'
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

  @Get('search/by')
  @ApiOperation({ summary: 'Search book by title or author' })
  @ApiOkResponse({
    description: 'Books Fetched Successfully',
    type: [Book]
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async searchBooks (@Query('q') searchTerm: string): Promise<any> {
    try {
      console.log(searchTerm)
      const books = await this.bookService.findBooksByTitleOrAuthor(searchTerm)
      return {
        success: true,
        data: books,
        message: 'Books Fetched Successfully'
      }
    } catch (error) {
      this.logger.error(`Error searching books by title or author with term: ${searchTerm}`, error.stack)
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get('getAll/popular')
  @ApiOperation({ summary: 'Get books with rating >= minRating' })
  @ApiOkResponse({
    description: 'Books Fetched Successfully',
    type: [Book]
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findBooksByRating (): Promise<any> {
    try {
      const books = await this.bookService.findPopularBooks(4)
      return {
        success: true,
        data: books,
        message: 'Books Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

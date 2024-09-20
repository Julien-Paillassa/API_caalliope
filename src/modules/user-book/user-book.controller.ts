import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common'
import { UserBookService } from './user-book.service'
import { UserBook } from './entities/user-book.entity'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { CreateUserBookDto } from './dto/create-user-book.dto'
import { UpdateUserBookDto } from './dto/update-user-book.dto'

@ApiBearerAuth()
@ApiTags('user-book')
@Controller('user-book')
export class UserBookController {
  constructor (private readonly userBookService: UserBookService) {}

  @Post()
  @ApiOperation({ summary: 'Add book to user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserBook
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async addBookToUser (@Body() createUserBookDto: CreateUserBookDto): Promise<UserBook> {
    try {
      const data = await this.userBookService.addBookToUser(createUserBookDto)
      return data
    } catch (error) {
      throw new Error(error.message as string)
    }
  }

  @Put()
  @ApiOperation({ summary: 'Update book status' })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: UserBook
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateBookStatus (
    @Body('userId') userId: number,
      @Body('bookId') bookId: number,
      @Body() updateUserBookDto: UpdateUserBookDto
  ): Promise<UserBook> {
    try {
      const data = await this.userBookService.updateBookStatus(userId, bookId, updateUserBookDto)
      return data
    } catch (error) {
      throw new Error(error.message as string)
    }
  }

  @Get(':userId')
  async getBooksForUser (@Param('userId') userId: number): Promise<UserBook[]> {
    try {
      const data = await this.userBookService.getBooksForUser(userId)
      return data
    } catch (error) {
      throw new Error(error.message as string)
    }
  }
}

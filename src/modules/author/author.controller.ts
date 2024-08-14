import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { AuthorService } from './author.service'
import { CreateAuthorDto } from './dto/create-author.dto'
import { UpdateAuthorDto } from './dto/update-author.dto'
import { Author } from './entities/author.entity'
import { ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('author')
@Controller('author')
export class AuthorController {
  constructor (private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Create author' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Author
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createAuthorDto: CreateAuthorDto): Promise<any> {
    try {
      const author = await this.authorService.create(createAuthorDto)

      return {
        success: true,
        message: 'Author Created Successfully',
        data: author
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiCreatedResponse({
    description: 'Authors Fetched Successfully',
    type: [Author]
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAll (): Promise<any> {
    try {
      const data = await this.authorService.findAll()
      return {
        success: true,
        data,
        message: 'Authors Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get author by id' })
  @ApiCreatedResponse({
    description: 'Author Fetched Successfully',
    type: Author
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.authorService.findOne(+id)
      return {
        success: true,
        data,
        message: 'Author Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update author by id' })
  @ApiCreatedResponse({
    description: 'Author Updated Successfully',
    type: Author
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Author Not Found' })
  async update (@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto): Promise<any> {
    try {
      const author = await this.authorService.update(+id, updateAuthorDto)
      return {
        success: true,
        message: 'Author Updated Successfully',
        data: author
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete author by id' })
  @ApiCreatedResponse({
    description: 'Author Deleted Successfully',
    type: Author
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Author Not Found' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      const author = await this.authorService.remove(+id)
      return {
        success: true,
        message: 'Author Deleted Successfully',
        data: author
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { GenreService } from './genre.service'
import { CreateGenreDto } from './dto/create-genre.dto'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Genre } from './entities/genre.entity'

@ApiBearerAuth()
@ApiTags('genre')
@Controller('genre')
export class GenreController {
  constructor (private readonly genreService: GenreService) {}

  @Post()
  @ApiOperation({ summary: 'Create genre' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Genre
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createGenreDto: CreateGenreDto): Promise<any> {
    try {
      const genre = await this.genreService.create(createGenreDto)

      return {
        success: true,
        message: 'Genre Created Successfully',
        data: genre
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all genre' })
  @ApiCreatedResponse({
    description: 'All Genres Fetched Successfully',
    type: [Genre]
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAll (): Promise<any> {
    try {
      const data = await this.genreService.findAll()
      return {
        success: true,
        data,
        message: 'All Genres Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by id' })
  @ApiCreatedResponse({
    description: 'Genre Fetched Successfully',
    type: Genre
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.genreService.findOne(+id)
      return {
        success: true,
        data,
        message: 'Genre Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update genre' })
  @ApiCreatedResponse({
    description: 'Genre Updated Successfully',
    type: Genre
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Genre Not Found' })
  async update (@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto): Promise<any> {
    try {
      const genre = await this.genreService.update(+id, updateGenreDto)
      return {
        success: true,
        message: 'Genre Updated Successfully',
        data: genre
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete genre by id' })
  @ApiCreatedResponse({
    description: 'Genre Deleted Successfully',
    type: Genre
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Genre Not Found' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      const genre = await this.genreService.remove(+id)
      return {
        success: true,
        message: 'Genre Deleted Successfully',
        data: genre
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

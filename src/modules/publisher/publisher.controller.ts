import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { PublisherService } from './publisher.service'
import { CreatePublisherDto } from './dto/create-publisher.dto'
import { UpdatePublisherDto } from './dto/update-publisher.dto'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Publisher } from './entities/publisher.entity'

@ApiBearerAuth()
@ApiTags('publisher')
@Controller('publisher')
export class PublisherController {
  constructor (private readonly publisherService: PublisherService) {}

  @Post()
  @ApiOperation({ summary: 'Create publisher' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Publisher
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createPublisherDto: CreatePublisherDto): Promise<any> {
    try {
      const publisher = await this.publisherService.create(createPublisherDto)

      return {
        success: true,
        message: 'Publisher Created Successfully',
        data: publisher
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all publishers' })
  @ApiCreatedResponse({
    description: 'Publishers Fetched Successfully',
    type: [Publisher]
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAll (): Promise<any> {
    try {
      const data = await this.publisherService.findAll()
      return {
        success: true,
        data,
        message: 'Publishers Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get publisher by id' })
  @ApiCreatedResponse({
    description: 'Publisher Fetched Successfully',
    type: Publisher
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.publisherService.findOne(+id)
      return {
        success: true,
        data,
        message: 'Publisher Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update publisher' })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: Publisher
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Publisher Not Found' })
  async update (@Param('id') id: string, @Body() updatePublisherDto: UpdatePublisherDto): Promise<any> {
    try {
      const data = await this.publisherService.update(+id, updatePublisherDto)
      return {
        success: true,
        data,
        message: 'Publisher Updated Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Publisher Not Found' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.publisherService.remove(+id)
      return {
        success: true,
        data,
        message: 'Publisher Removed Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

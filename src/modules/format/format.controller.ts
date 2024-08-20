import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { FormatService } from './format.service'
import { CreateFormatDto } from './dto/create-format.dto'
import { UpdateFormatDto } from './dto/update-format.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth
} from '@nestjs/swagger'
import { Format } from './entities/format.entity'

@ApiBearerAuth()
@ApiTags('format')
@Controller('format')
export class FormatController {
  constructor (private readonly formatService: FormatService) {}

  @Post()
  @ApiOperation({ summary: 'Create format' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Format
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createFormatDto: CreateFormatDto): Promise<any> {
    try {
      const format = await this.formatService.create(createFormatDto)

      return {
        success: true,
        message: 'Format Created Successfully',
        data: format
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all formats' })
  @ApiCreatedResponse({
    description: 'Formats Fetched Successfully',
    type: [Format]
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll (): Promise<any> {
    try {
      const data = await this.formatService.findAll()
      return {
        success: true,
        data,
        message: 'Formats Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get format by id' })
  @ApiCreatedResponse({
    description: 'Format Fetched Successfully',
    type: Format
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.formatService.findOne(+id)
      return {
        success: true,
        data,
        message: 'Format Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update format' })
  @ApiCreatedResponse({
    description: 'Format Updated Successfully',
    type: Format
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async update (@Param('id') id: string, @Body() updateFormatDto: UpdateFormatDto): Promise<any> {
    try {
      const format = await this.formatService.update(+id, updateFormatDto)
      return {
        success: true,
        message: 'Format Updated Successfully',
        data: format
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete format' })
  @ApiCreatedResponse({
    description: 'Format Deleted Successfully',
    type: Format
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      const format = await this.formatService.remove(+id)
      return {
        success: true,
        message: 'Format Deleted Successfully',
        data: format
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

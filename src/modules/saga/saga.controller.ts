import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { SagaService } from './saga.service'
import { CreateSagaDto } from './dto/create-saga.dto'
import { UpdateSagaDto } from './dto/update-saga.dto'
import { Saga } from './entities/saga.entity'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('saga')
@Controller('')
export class SagaController {
  constructor (private readonly sagaService: SagaService) {}

  @Post()
  @ApiOperation({ summary: 'Create saga' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Saga
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createSagaDto: CreateSagaDto): Promise<any> {
    try {
      const saga = await this.sagaService.create(createSagaDto)

      return {
        success: true,
        message: 'Saga Created Successfully',
        data: saga
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all sagas' })
  @ApiCreatedResponse({
    description: 'Sagas Fetched Successfully',
    type: [Saga]
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAll (): Promise<any> {
    try {
      const data = await this.sagaService.findAll()
      return {
        success: true,
        data,
        message: 'Sagas Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get saga by id' })
  @ApiCreatedResponse({
    description: 'Saga Fetched Successfully',
    type: Saga
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.sagaService.findOne(+id)
      return {
        success: true,
        data,
        message: 'Saga Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update saga by id' })
  @ApiCreatedResponse({
    description: 'Saga Updated Successfully',
    type: Saga
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Author Not Found' })
  async update (@Param('id') id: string, @Body() updateSagaDto: UpdateSagaDto): Promise<any> {
    try {
      const saga = await this.sagaService.update(+id, updateSagaDto)

      return {
        success: true,
        message: 'Saga Updated Successfully',
        data: saga
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete saga by id' })
  @ApiCreatedResponse({
    description: 'Saga Removed Successfully',
    type: Saga
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Author Not Found' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      const saga = await this.sagaService.remove(+id)

      return {
        success: true,
        message: 'Saga Removed Successfully',
        data: saga
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

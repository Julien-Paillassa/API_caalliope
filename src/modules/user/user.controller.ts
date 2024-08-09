import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger'
import { User } from './entities/user.entity'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create (@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const salt = await bcrypt.genSalt(10)
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt)

      const user = await this.userService.create(createUserDto)

      return {
        success: true,
        message: 'User Created Successfully',
        data: user
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Users Fetched Successfully',
    type: [User]
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll (): Promise<any> {
    try {
      const data = await this.userService.findAll()
      return {
        success: true,
        data,
        message: 'Users Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({
    description: 'User Fetched Successfully',
    type: User
  })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findOne (@Param('id') id: string): Promise<any> {
    try {
      const data = await this.userService.findOne(+id)
      return {
        success: true,
        data,
        message: 'User Fetched Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({
    description: 'User Updated Successfully',
    type: User
  })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update (@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const user = await this.userService.update(+id, updateUserDto)
      return {
        success: true,
        message: 'User Updated Successfully',
        data: user
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({
    description: 'User Deleted Successfully',
    type: User
  })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove (@Param('id') id: string): Promise<any> {
    try {
      await this.userService.remove(+id)
      return {
        success: true,
        message: 'User Deleted Successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

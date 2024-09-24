import { Controller, Post, UploadedFile, Body, UseInterceptors, HttpException, HttpStatus, Logger, Put, Delete } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AvatarService } from './avatar.service'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { promises as fsPromises } from 'fs'
import { AuthorService } from '../author/author.service'
import { UserService } from '../user/user.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from '../author/entities/author.entity'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'
import { OrchestratorService } from '../orchestrator/ochestrator.service'

@ApiBearerAuth()
@ApiTags('avatar')
@Controller('avatar')
export class AvatarController {
  private readonly logger = new Logger(AvatarController.name)

  constructor (
    private readonly avatarService: AvatarService,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly authorService: AuthorService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly orchestratorService: OrchestratorService
  ) {}

  @Post('upload/userAvatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar for an user' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Upload avatar data',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar file'
        },
        userId: {
          type: 'number',
          example: 1,
          description: 'ID of the user associated with the avatar'
        }
      },
      required: ['avatar']
    }
  })
  async uploadUserAvatar (
    @UploadedFile() avatar: Express.Multer.File,
      @Body() { userId }: { userId: number }
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!avatar) {
        throw new HttpException('Avatar file is required', HttpStatus.BAD_REQUEST)
      }
      return await this.orchestratorService.uploadAvatarToUser(avatar, userId)
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar for an author' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Upload avatar data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar file'
        },
        authorId: {
          type: 'number',
          example: 5,
          description: 'ID of the author associated with the avatar'
        },
        userId: {
          type: 'number',
          example: 1,
          description: 'ID of the user associated with the avatar'
        }
      },
      required: ['file']
    }
  })
  async uploadAvatar (
    @UploadedFile() file: Express.Multer.File,
      @Body() { authorId, userId }: { authorId: number, userId: number }
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
      }

      let directoryPath = './uploads/avatars/'

      if (Number(authorId) !== 0) {
        const author = await this.authorRepository.findOne({ where: { id: authorId } })
        if (author == null) {
          throw new HttpException('Author not found', HttpStatus.NOT_FOUND)
        }

        directoryPath += 'authors/'
        const originalName = file.originalname
        const lastDotIndex = originalName.lastIndexOf('.')
        const fileExtension = originalName.substring(lastDotIndex)
        const filename = `${author.firstName}-${author.lastName}-id${author.id}_avatar${fileExtension}`
        const filePath = `${directoryPath}${filename}`

        await fsPromises.mkdir(directoryPath, { recursive: true })
        await fsPromises.copyFile(file.path, filePath)
        await fsPromises.unlink(file.path)

        const avatar = await this.avatarService.saveAvatar(filename, undefined, author)

        return {
          success: true,
          message: 'Author avatar uploaded and saved successfully',
          data: avatar
        }
      } else if (Number(userId) !== 0) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (user == null) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        directoryPath += 'users/'
        const originalName = file.originalname
        const lastDotIndex = originalName.lastIndexOf('.')
        const fileExtension = originalName.substring(lastDotIndex)
        const filename = `${user.firstName}-${user.lastName}-id${user.id}_avatar${fileExtension}`
        const filePath = `${directoryPath}${filename}`

        await fsPromises.mkdir(directoryPath, { recursive: true })
        await fsPromises.copyFile(file.path, filePath)
        await fsPromises.unlink(file.path)

        const avatar = await this.avatarService.saveAvatar(filename, user, undefined)

        return {
          success: true,
          message: 'User avatar uploaded and saved successfully',
          data: avatar
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update avatar for an author or user' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Update avatar data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar file'
        },
        authorId: {
          type: 'number',
          example: 5,
          description: 'ID of the author associated with the avatar'
        },
        userId: {
          type: 'number',
          example: 1,
          description: 'ID of the user associated with the avatar'
        }
      },
      required: ['file']
    }
  })
  async updateAvatar (
    @UploadedFile() file: Express.Multer.File,
      @Body() { authorId, userId }: { authorId: number, userId: number }
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
      }

      let directoryPath = './uploads/avatars/'
      let filename: string
      let avatar: any

      if (Number(authorId) !== 0) {
        const author = await this.authorService.findOne(authorId)
        if (author == null) {
          throw new HttpException('Author not found', HttpStatus.NOT_FOUND)
        }

        avatar = await this.avatarService.findByAuthorId(authorId)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!avatar) {
          throw new HttpException('Avatar not found for this author', HttpStatus.NOT_FOUND)
        }

        directoryPath += 'authors/'
        filename = `${author.firstName}-${author.lastName}-id${author.id}_avatar${file.originalname.slice(file.originalname.lastIndexOf('.'))}`
      } else if (Number(userId) !== 0) {
        const user = await this.userService.findOne(userId)
        if (user == null) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        avatar = await this.avatarService.findByUserId(userId)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!avatar) {
          throw new HttpException('Avatar not found for this user', HttpStatus.NOT_FOUND)
        }

        directoryPath += 'users/'
        filename = `${user.firstName}-${user.lastName}-id${user.id}_avatar${file.originalname.slice(file.originalname.lastIndexOf('.'))}`
      } else {
        throw new HttpException('Invalid authorId or userId', HttpStatus.BAD_REQUEST)
      }

      // Vérifier si le répertoire existe et le créer si nécessaire
      await fsPromises.mkdir(directoryPath, { recursive: true })

      // Supprimer l'ancien fichier
      const oldFilePath = `${directoryPath}${avatar.filename}`
      const oldFileExists = await fsPromises.access(oldFilePath).then(() => true).catch(() => false)
      if (oldFileExists) {
        await fsPromises.unlink(oldFilePath)
      }

      // Sauvegarder le nouveau fichier
      const newFilePath = `${directoryPath}${filename}`
      await fsPromises.copyFile(file.path, newFilePath)
      await fsPromises.unlink(file.path)

      // Mettre à jour l'avatar dans la base de données
      avatar.filename = filename
      const updatedAvatar = await this.avatarService.updateAvatar(avatar)

      return {
        success: true,
        message: 'Avatar updated successfully',
        data: updatedAvatar
      }
    } catch (error) {
      this.logger.error('Error updating avatar', error.stack)
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete avatar for an author or user' })
  @ApiResponse({ status: 200, description: 'Avatar deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Delete avatar data',
    schema: {
      type: 'object',
      properties: {
        authorId: {
          type: 'number',
          example: 5,
          description: 'ID of the author associated with the avatar'
        },
        userId: {
          type: 'number',
          example: 1,
          description: 'ID of the user associated with the avatar'
        }
      }
    }
  })
  async deleteAvatar (
    @Body() { authorId, userId }: { authorId: number, userId: number }
  ): Promise<any> {
    try {
      let avatar

      if (authorId !== 0) {
        avatar = await this.avatarService.findByAuthorId(authorId)
      } else if (userId !== 0) {
        avatar = await this.avatarService.findByUserId(userId)
      }

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!avatar) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND)
      }

      // Supprimer l'avatar de la base de données
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.avatarService.deleteAvatar(avatar.id)

      // Supprimer le fichier de l'avatar
      const filePath = authorId !== 0
        ? `./uploads/avatars/authors/${avatar.filename}`
        : `./uploads/avatars/users/${avatar.filename}`

      try {
        await fsPromises.unlink(filePath)
      } catch (err) {
        console.error('Error deleting file:', err)
        throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return {
        success: true,
        message: 'Avatar deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

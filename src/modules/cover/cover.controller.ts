import { Body, Controller, Delete, HttpException, HttpStatus, Logger, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { CoverService } from './cover.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { BookService } from '../book/book.service'
import { Book } from '../book/entities/book.entity'
import { FileInterceptor } from '@nestjs/platform-express'
import { promises as fsPromises } from 'fs'

@ApiBearerAuth()
@ApiTags('cover')
@Controller('cover')
export class CoverController {
  private readonly logger = new Logger(CoverController.name)

  constructor (
    private readonly coverService: CoverService,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly bookService: BookService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload cover for an book' })
  @ApiResponse({ status: 201, description: 'Cover uploaded successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Upload cover data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'cover file'
        },
        bookId: {
          type: 'number',
          example: 2,
          description: 'ID of the book associated with the cover'
        }
      },
      required: ['file']
    }
  })
  async uploadCover (
    @UploadedFile() file: Express.Multer.File,
      @Body() { bookId }: { bookId: number }
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
      }

      const directoryPath = './uploads/covers/'

      if (Number(bookId) !== 0) {
        const book = await this.bookRepository.findOne({ where: { id: bookId } })
        if (book == null) {
          throw new HttpException('Book not found', HttpStatus.NOT_FOUND)
        }

        const originalName = file.originalname
        const lastDotIndex = originalName.lastIndexOf('.')
        const fileExtension = originalName.substring(lastDotIndex)
        const filename = `${book.title}-id${book.id}_avatar${fileExtension}`
        const filePath = `${directoryPath}${filename}`

        await fsPromises.mkdir(directoryPath, { recursive: true })
        await fsPromises.copyFile(file.path, filePath)
        await fsPromises.unlink(file.path)

        const cover = await this.coverService.saveCover(filename, book)

        return {
          success: true,
          message: 'Book cover uploaded and saved successfully',
          data: cover
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
  @ApiOperation({ summary: 'Update cover for a book' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Update cover data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Cover file'
        },
        bookId: {
          type: 'number',
          example: 5,
          description: 'ID of the book associated with the cover'
        }
      },
      required: ['file']
    }
  })
  async updateAvatar (
    @UploadedFile() file: Express.Multer.File,
      @Body() { bookId }: { bookId: number }
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
      }

      const directoryPath = './uploads/covers/'
      let filename: string
      let cover: any // Utiliser cette variable globalement

      if (Number(bookId) !== 0) {
        const book = await this.bookService.findOne(bookId)
        if (book == null) {
          throw new HttpException('Book not found', HttpStatus.NOT_FOUND)
        }

        cover = await this.coverService.findByBookId(bookId) // Pas de 'const' ici
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!cover) {
          throw new HttpException('Cover not found for this book', HttpStatus.NOT_FOUND)
        }

        filename = `${book.title}-id${book.id}_avatar${file.originalname.slice(file.originalname.lastIndexOf('.'))}`
      } else {
        throw new HttpException('Invalid bookId', HttpStatus.BAD_REQUEST)
      }

      // Vérifier si le répertoire existe et le créer si nécessaire
      await fsPromises.mkdir(directoryPath, { recursive: true })

      // Supprimer l'ancien fichier
      const oldFilePath = `${directoryPath}${cover.filename}`
      const oldFileExists = await fsPromises.access(oldFilePath).then(() => true).catch(() => false)
      if (oldFileExists) {
        await fsPromises.unlink(oldFilePath)
      }

      // Sauvegarder le nouveau fichier
      const newFilePath = `${directoryPath}${filename}`
      await fsPromises.copyFile(file.path, newFilePath)
      await fsPromises.unlink(file.path)

      // Mettre à jour l'avatar dans la base de données
      cover.filename = filename
      const updatedCover = await this.coverService.updateCover(cover)

      return {
        success: true,
        message: 'Cover updated successfully',
        data: updatedCover
      }
    } catch (error) {
      this.logger.error('Error updating cover', error.stack)
      return {
        success: false,
        message: error.message
      }
    }
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete cover for an book' })
  @ApiResponse({ status: 200, description: 'Cover deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({
    description: 'Delete cover data',
    schema: {
      type: 'object',
      properties: {
        bookId: {
          type: 'number',
          example: 5,
          description: 'ID of the book associated with the cover'
        }
      }
    }
  })
  async deleteAvatar (
    @Body() { bookId }: { bookId: number }
  ): Promise<any> {
    try {
      const cover = await this.coverService.findByBookId(bookId)

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!cover) {
        throw new HttpException('Cover not found', HttpStatus.NOT_FOUND)
      }

      // Supprimer l'avatar de la base de données
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.coverService.deleteCover(cover.id)

      // Supprimer le fichier de l'avatar
      const filePath = `./uploads/covers/${cover.filename}`

      try {
        await fsPromises.unlink(filePath)
      } catch (err) {
        console.error('Error deleting file:', err)
        throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return {
        success: true,
        message: 'Cover deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

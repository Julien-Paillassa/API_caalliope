import { PartialType } from '@nestjs/mapped-types'
import { CreateUserBookDto } from './create-user-book.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { BookStatus } from '../entities/book-status.enum'

export class UpdateUserBookDto extends PartialType(CreateUserBookDto) {
  @ApiProperty({
    description: 'Status of the user book',
    example: 'reading',
    enum: BookStatus // Utilisez enum ici pour Swagger
  })
  @IsNotEmpty()
  @IsEnum(BookStatus) // Utilisez IsEnum pour la validation
    status: BookStatus
}

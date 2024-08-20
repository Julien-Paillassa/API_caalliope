import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { BookStatus } from '../entities/book-status.enum'

export class CreateUserBookDto {
  @ApiProperty({
    description: 'Status of the user book',
    example: 'reading',
    enum: BookStatus
  })
  @IsNotEmpty()
  @IsEnum(BookStatus)
    status: BookStatus

  @ApiProperty({
    description: 'Id of the book',
    example: 5
  })
  @IsNotEmpty()
  @IsNumber()
    bookId: number

  @ApiProperty({
    description: 'Id of the user',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
    userId: number
}

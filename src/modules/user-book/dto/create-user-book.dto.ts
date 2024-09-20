import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { UserBookStatus } from '../entities/user-book-status.enum'

export class CreateUserBookDto {
  @ApiProperty({
    description: 'Status of the user book',
    example: 'reading',
    enum: UserBookStatus
  })
  @IsNotEmpty()
  @IsEnum(UserBookStatus)
    status: UserBookStatus

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

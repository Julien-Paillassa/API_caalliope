import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber
} from 'class-validator'

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a great book'
  })
  @IsNotEmpty()
  @IsString()
    content: string

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

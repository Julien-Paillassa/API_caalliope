import { PartialType } from '@nestjs/mapped-types'
import { CreateCommentDto } from './create-comment.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { Status } from './../../admin/entities/status.enum'

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a bad book',
    required: false
  })
  @IsString()
    content?: string

  @ApiProperty({
    description: 'Rating of the comment',
    example: 1,
    required: false
  })
  @IsNumber()
  @Min(1)
  @Max(5)
    rating?: number

  @ApiProperty({
    description: 'Status of the book',
    example: 'accepted',
    enum: Status,
    required: false
  })
  @IsNotEmpty()
  @IsEnum(Status)
    status: Status

  @ApiProperty({
    description: 'User ID',
    example: 1,
    required: false
  })
  @IsNumber()
    userId: number

  @ApiProperty({
    description: 'Book ID',
    example: 1,
    required: false
  })
  @IsNumber()
    bookId: number
}

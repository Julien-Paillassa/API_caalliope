import { PartialType } from '@nestjs/mapped-types'
import { CreateCommentDto } from './create-comment.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

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
    rating?: number
}

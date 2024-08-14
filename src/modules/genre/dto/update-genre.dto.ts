import { PartialType } from '@nestjs/mapped-types'
import { CreateGenreDto } from './create-genre.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @ApiProperty({
    description: 'Genre of the book',
    example: 'Fantasy',
    required: false
  })
  @IsString()
    genre?: string
}

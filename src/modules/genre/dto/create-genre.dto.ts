import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString
} from 'class-validator'

export class CreateGenreDto {
  @ApiProperty({
    description: 'Genre of the book',
    example: 'Science fiction'
  })
  @IsNotEmpty()
  @IsString()
    genre: string
}

import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber, IsOptional, IsIn
} from 'class-validator'

export class CreatePublishingDto {
  @ApiProperty({
    description: 'Label of the publishing',
    example: 'Hachette'
  })
  @IsNotEmpty()
  @IsString()
  editor: string

  @ApiProperty({
    description: 'Language of the publishing',
    example: 'French'
  })
  @IsOptional()
  @IsString()
    language?: string

  @ApiProperty({
    description: 'ISBN of the publishing',
    example: '9782070423201'
  })
  @IsNotEmpty()
  @IsString()
    isbn: string

  @ApiProperty({
    description: 'Number of pages of the publishing',
    example: 200
  })
  @IsNotEmpty()
  @IsString()
    nbPages: string

  @ApiProperty({
    description: 'Publication date of the publishing',
    example: '2021-01-01'
  })
  @IsNotEmpty()
  @IsString()
    date: string

  @ApiProperty({
    description: 'Format of the book',
    example: 'paper',
    enum: ['paper', 'ebook', 'audio'],
  })
  @IsNotEmpty()
  @IsIn(['paper', 'ebook', 'audio'], { message: 'Invalid format' })
  format: 'paper' | 'ebook' | 'audio';
}

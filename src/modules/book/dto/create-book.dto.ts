import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional, IsIn, Matches } from 'class-validator'

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'The Hobbit'
  })
  @IsNotEmpty()
  @IsString()
    title: string

  @ApiProperty({
    description: 'Summary of the book',
    example: '“The Hobbit” by J.R.R. Tolkien follows Bilbo Baggins...'
  })
  @IsOptional()
  @IsString()
    summary?: string

  @ApiProperty({
    description: 'Publication date of the book',
    example: '1937-09-21'
  })
  @IsNotEmpty()
  @IsString()
    date: string

  @ApiProperty({
    description: 'ISBN of the book',
    example: '978-3-16-148410-0'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}(\d{3})?$/, { message: 'Invalid ISBN format' })
    isbn: string

  @ApiProperty({
    description: 'Author of the book',
    example: 'J.R.R. Tolkien'
  })
  @IsNotEmpty()
  @IsString()
    author: string

  @ApiProperty({
    description: 'Editor of the book',
    example: 'Allen & Unwin'
  })
  @IsNotEmpty()
  @IsString()
    editor: string

  @ApiProperty({
    description: 'Translator of the book (if any)',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
    translator?: string

  @ApiProperty({
    description: 'Number of pages in the book',
    example: 310
  })
  @IsNotEmpty()
  @IsString()
  // @Min(1, { message: 'Number of pages must be at least 1' })
    nbPage: string

  @ApiProperty({
    description: 'Language of the book',
    example: 'English'
  })
  @IsOptional()
  @IsString()
    language?: string

  @ApiProperty({
    description: 'Format of the book',
    example: 'paper',
    enum: ['paper', 'ebook', 'audio']
  })
  @IsNotEmpty()
  @IsIn(['paper', 'ebook', 'audio'], { message: 'Invalid format' })
    format: 'paper' | 'ebook' | 'audio'

  @ApiProperty({
    description: 'Cover image of the book',
    type: 'string',
    format: 'binary',
    required: false
  })
  @IsOptional()
    cover?: Express.Multer.File

  @IsOptional()
    genre?: string
}

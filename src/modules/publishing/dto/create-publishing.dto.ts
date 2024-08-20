import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber
} from 'class-validator'

export class CreatePublishingDto {
  @ApiProperty({
    description: 'Label of the publishing',
    example: 'Hachette'
  })
  @IsNotEmpty()
  @IsString()
    label: string

  @ApiProperty({
    description: 'Language of the publishing',
    example: 'French'
  })
  @IsNotEmpty()
  @IsString()
    language: string

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
  @IsNumber()
    nbPages: number

  @ApiProperty({
    description: 'Publication date of the publishing',
    example: '2021-01-01'
  })
  @IsNotEmpty()
  @IsString()
    publicationDate: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFormatDto {
  @ApiProperty({
    description: 'Type of the format',
    example: 'Paperback'
  })
  @IsNotEmpty()
  @IsString()
    type: string

  @ApiProperty({
    description: 'Language of the format',
    example: 'English'
  })
  @IsNotEmpty()
  @IsString()
    language: string
}

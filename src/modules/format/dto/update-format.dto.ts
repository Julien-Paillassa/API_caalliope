import { PartialType } from '@nestjs/mapped-types'
import { CreateFormatDto } from './create-format.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateFormatDto extends PartialType(CreateFormatDto) {
  @ApiProperty({
    description: 'Type of the format',
    example: 'Pocket',
    required: false
  })
  @IsString()
    type?: string

  @ApiProperty({
    description: 'Language of the format',
    example: 'French',
    required: false
  })
  @IsString()
    language?: string
}

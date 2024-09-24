import { PartialType } from '@nestjs/mapped-types'
import { CreatePublishingDto } from './create-publishing.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Status } from './../../admin/entities/status.enum'

export class UpdatePublishingDto extends PartialType(CreatePublishingDto) {
  @ApiProperty({
    description: 'ID of the edition',
    example: '1',
    required: true
  })
  @IsNumber()
    id: number

  @ApiProperty({
    description: 'Label of the publishing',
    example: 'Gallimard',
    required: false
  })
  @IsString()
    label?: string

  @ApiProperty({
    description: 'Language of the publishing',
    example: 'English',
    required: false
  })
  @IsString()
    language?: string

  @ApiProperty({
    description: 'ISBN of the publishing',
    example: '9782070423202',
    required: false
  })
  @IsString()
    isbn?: string

  @ApiProperty({
    description: 'Number of pages of the publishing',
    example: 250,
    required: false
  })
  @IsString()
    nbPages?: string

  @ApiProperty({
    description: 'Publication date of the publishing',
    example: '2021-01-02',
    required: false
  })
  @IsString()
    publicationDate?: string

  @ApiProperty({
    description: 'Status of the book',
    example: 'accepted',
    enum: Status,
    required: false
  })
  @IsNotEmpty()
  @IsEnum(Status)
    status: Status
}

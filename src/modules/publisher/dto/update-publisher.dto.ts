import { PartialType } from '@nestjs/mapped-types'
import { CreatePublisherDto } from './create-publisher.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePublisherDto extends PartialType(CreatePublisherDto) {
  @ApiProperty({
    description: 'Name of the publisher',
    example: 'Lion Random House',
    required: false
  })
    name?: string
}

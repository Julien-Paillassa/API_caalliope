import { PartialType } from '@nestjs/mapped-types'
import { CreateSagaDto } from './create-saga.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class UpdateSagaDto extends PartialType(CreateSagaDto) {
  @ApiProperty({
    description: 'Title of the saga',
    example: 'Lord Of The Rings'
  })
  @IsString()
    title?: string

  @ApiProperty({
    description: 'Description of the saga',
    example: 'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.'
  })
  @IsString()
    description?: string

  @ApiProperty({
    description: 'Number of volumes in the saga',
    example: 3
  })
  @IsNumber()
    nbVolumes?: number
}

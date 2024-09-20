import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateSagaDto {
  @ApiProperty({
    description: 'Title of the saga',
    example: 'Harry Potter'
  })
  @IsNotEmpty()
  @IsString()
    title: string

  @ApiProperty({
    description: 'Description of the saga',
    example: 'Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling.'
  })
  @IsNotEmpty()
  @IsString()
    description: string

  @ApiProperty({
    description: 'Number of volumes in the saga',
    example: 7
  })
  @IsNotEmpty()
  @IsNumber()
    nbVolumes: number
}

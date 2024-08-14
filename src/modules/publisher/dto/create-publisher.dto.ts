import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePublisherDto {
  @ApiProperty({
    description: 'Name of the publisher',
    example: 'Penguin Random House'
  })
  @IsNotEmpty()
  @IsString()
    name: string
}

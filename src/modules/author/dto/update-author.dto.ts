import { PartialType } from '@nestjs/mapped-types'
import { CreateAuthorDto } from './create-author.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @ApiProperty({
    description: 'First name of the author',
    example: 'Jeanne',
    required: false
  })
  @IsString()
    firstName?: string

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Williams',
    required: false
  })
  @IsString()
    lastName?: string

  @ApiProperty({
    description: 'Email address of the author',
    example: 'jeanne.williams@exemple.com',
    required: false
  })
  @IsEmail()
    email?: string

  @ApiProperty({
    description: 'Birth date of the author',
    example: '1975-01-01',
    required: false
  })
  @IsString()
    birthDate?: string
}

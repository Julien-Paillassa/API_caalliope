import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsEmail
} from 'class-validator'

export class CreateAuthorDto {
  @ApiProperty({
    description: 'First name of the author',
    example: 'John'
  })
  @IsNotEmpty()
  @IsString()
    firstName: string

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Smith'
  })
  @IsNotEmpty()
  @IsString()
    lastName: string

  @ApiProperty({
    description: 'Email address of the author',
    example: 'john.smith@exemple.com'
  })
  @IsNotEmpty()
  @IsEmail()
    email: string

  @ApiProperty({
    description: 'Birth date of the author',
    example: '1970-01-01'
  })
  @IsNotEmpty()
  @IsString()
    birthDate: string
}

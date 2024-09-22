import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsEmail, IsDefined
} from 'class-validator'

export class CreateAuthorDto {
  @ApiProperty({
    description: 'First name of the author',
    example: 'John'
  })
  @IsDefined()
  @IsString()
    firstName: string

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Smith'
  })
  @IsDefined()
  @IsString()
    lastName: string

  @IsNotEmpty()
  @IsString()
    fullName: string

  @ApiProperty({
    description: 'Email address of the author',
    example: 'john.smith@exemple.com'
  })
  @IsDefined()
  @IsEmail()
    email: string

  @ApiProperty({
    description: 'Birth date of the author',
    example: '1970-01-01'
  })
  @IsDefined()
  @IsString()
    birthDate: string
}

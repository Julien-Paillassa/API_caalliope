import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  @IsNotEmpty()
  @IsString()
    firstName: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe'
  })
  @IsNotEmpty()
  @IsString()
    lastName: string

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword123'
  })
  @IsNotEmpty()
  @IsString()
    password: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string

  @ApiProperty({
    description: 'Username for the user account',
    example: 'johndoe'
  })
  @IsNotEmpty()
  @IsString()
    username: string
}

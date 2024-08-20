import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty()
  @IsString()
    email: string

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword123'
  })
  @IsNotEmpty()
  @IsString()
    password: string
}

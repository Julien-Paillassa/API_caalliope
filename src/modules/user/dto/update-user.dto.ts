import { PartialType, ApiProperty } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Johnny',
    required: false
  })
    firstName?: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doeson',
    required: false
  })
    lastName?: string

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword987',
    required: false
  })
    password?: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johnny.doeson@example.com',
    required: false
  })
    email?: string

  @ApiProperty({
    description: 'Username for the user account',
    example: 'johnnydoeson',
    required: false
  })
    username?: string
}

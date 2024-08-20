import { PartialType, ApiProperty } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { UserRole } from '../entities/user-role.enum'
import { IsEmail, IsEnum, IsString } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Johnny',
    required: false
  })
  @IsString()
    firstName?: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doeson',
    required: false
  })
  @IsString()
    lastName?: string

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword987',
    required: false
  })
  @IsString()
    password?: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johnny.doeson@example.com',
    required: false
  })
  @IsEmail()
    email?: string

  @ApiProperty({
    description: 'Username for the user account',
    example: 'johnnydoeson',
    required: false
  })
    username?: string

  @ApiProperty({
    description: 'Role of the user account',
    example: UserRole.MODERATOR,
    enum: UserRole,
    required: false
  })
  @IsEnum(UserRole)
    role: UserRole
}

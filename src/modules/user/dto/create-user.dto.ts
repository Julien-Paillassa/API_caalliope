import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum
} from 'class-validator'
import { UserRole } from '../entities/user-role.enum'

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Antoine'
  })
  @IsNotEmpty()
  @IsString()
    firstName: string

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Dupont'
  })
  @IsNotEmpty()
  @IsString()
    lastName: string

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword987'
  })
  @IsNotEmpty()
  @IsString()
    password: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'antoine.dupont@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
    email: string

  @ApiProperty({
    description: 'Username for the user account',
    example: 'antoinnette'
  })
  @IsNotEmpty()
  @IsString()
    username: string

  @ApiProperty({
    description: 'Role of the user account',
    example: UserRole.CONTRIBUTOR,
    enum: UserRole
  })
  @IsEnum(UserRole)
    role: UserRole
}

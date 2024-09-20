import { PartialType } from '@nestjs/mapped-types'
import { CreateUserBookDto } from './create-user-book.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { UserBookStatus } from '../entities/user-book-status.enum'

export class UpdateUserBookDto extends PartialType(CreateUserBookDto) {
  @ApiProperty({
    description: 'Status of the user book',
    example: 'reading',
    enum: UserBookStatus
  })
  @IsNotEmpty()
  @IsEnum(UserBookStatus)
    status: UserBookStatus
}

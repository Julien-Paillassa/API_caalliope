import { PartialType } from '@nestjs/mapped-types'
import { CreateBookDto } from './create-book.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { Status } from './../../admin/entities/status.enum'

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    description: 'ID of the book',
    example: '1',
    required: true
  })
  @IsNumber()
    id: number

  @ApiProperty({
    description: 'Title of the book',
    example: 'The Fellowship of the Ring',
    required: false
  })
  @IsString()
    title?: string

  @ApiProperty({
    description: 'Author of the book',
    example: 'J.R.R. Tolkien'
  })
  @IsString()
    author?: string

  @ApiProperty({
    description: 'Summary of the book',
    example: 'Frodo Baggins inherits the One Ring from his uncle Bilbo and learns from Gandalf the wizard that it must be destroyed to defeat the dark lord Sauron. Frodo sets out from the Shire with his friends Sam, Merry, and Pippin. They are joined by Aragorn and later form the Fellowship of the Ring with Gandalf, Legolas, Gimli, and Boromir. Together, they travel towards Mordor, facing dangers such as the Ringwraiths and the mines of Moria. The fellowship is eventually broken when Boromir tries to take the ring, and Frodo continues the journey with Sam.',
    required: false
  })
  @IsString()
    summary?: string

  @ApiProperty({
    description: 'Publication date of the book',
    example: '1954-07-29',
    required: false
  })
  @IsString()
    publicationDate?: string

  @ApiProperty({
    description: 'Status of the book',
    example: 'accepted',
    enum: Status,
    required: false
  })
  @IsNotEmpty()
  @IsEnum(Status)
    status: Status
}

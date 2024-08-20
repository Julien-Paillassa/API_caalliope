import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'The Hobbit'
  })
  @IsNotEmpty()
  @IsString()
    title: string

  @ApiProperty({
    description: 'Summary of the book',
    example: '“The Hobbit” by J.R.R. Tolkien follows Bilbo Baggins, a hobbit who enjoys a comfortable life in the Shire. His peace is disrupted when the wizard Gandalf and thirteen dwarves invite him on a quest to reclaim their homeland, the Lonely Mountain, from the dragon Smaug. Along the way, Bilbo encounters various dangers and finds a magical ring that makes him invisible. After confronting Smaug, the dragon is killed, sparking a battle over the mountain\'s treasure. The adventure changes Bilbo, and he returns home wiser and more courageous.'
  })
  @IsNotEmpty()
  @IsString()
    summary: string

  @ApiProperty({
    description: 'Publication date of the book',
    example: '1937-09-21'
  })
  @IsNotEmpty()
  @IsString()
    publicationDate: string
}

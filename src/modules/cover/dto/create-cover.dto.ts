import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCoverDto {
  @IsString()
  @IsNotEmpty()
    BookId: string
}

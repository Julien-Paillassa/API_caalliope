import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFormatDto {
  @IsNotEmpty()
  @IsString()
    format: string

  @IsNotEmpty()
  @IsString()
    language: string
}

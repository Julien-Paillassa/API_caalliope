import { IsNotEmpty, IsString } from 'class-validator'

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
    title: string

  @IsNotEmpty()
  @IsString()
    ibsn: string

  @IsNotEmpty()
  @IsString()
    cover: string

  @IsNotEmpty()
  @IsString()
    status: string

  @IsNotEmpty()
  @IsString()
    publisher: string

  @IsNotEmpty()
  @IsString()
    sagaId: number
}

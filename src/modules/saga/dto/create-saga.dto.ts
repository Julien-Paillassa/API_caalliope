import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateSagaDto {
  @IsNotEmpty()
  @IsString()
    title: string

  @IsNotEmpty()
  @IsString()
    description: string

  @IsNotEmpty()
  @IsNumber()
    nbVolumes: number
}
